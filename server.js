const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()

//Game values
const startingSalary = 5

//Set to false to stop server from logging (Database errors will still be output)
const serverLogs = true

//init database 
const mysql = require('mysql')
const dataCon = mysql.createConnection({
    host: '35.184.255.168',
    user: 'root', 
    password: 'testpass',
    database: 'test'
})

//for parsing data 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//for parsing form data
app.use(upload.array())

//use pulblic folder to send files from 
app.use(express.static('public'))

//use json for sending and recieving data 
app.use(express.json({limit: '1mb'}))

//send landing page to user
app.get('/', (req, res) => {
    console.log("Sending file")
    res.sendFile('login.html', {root: __dirname + '/public'})
})

//send home page
app.get('/home', (req, res) => {
    res.sendFile('home.html', {root: __dirname + '/public'})
})

//send create business page
app.get('/createBusiness', (req, res) => {
    console.log("Sending create busines page")
    res.sendFile('createBusiness.html', {root: __dirname + '/public'})  
})

//send create owner page
app.get('/createOwner', (req, res) => {
    console.log("Sending create owner page")
    res.sendFile('createOwner.html', {root: __dirname + '/public'})  
})

//send hire employee page
app.get('/hireEmployee', (req, res) => {
    res.sendFile('hireEmployee.html', {root: __dirname + '/public'})
})

//returns employees in selected business 
app.post('/getBusinessEmployees', (req, res) => {
    const data = req.body
    getBusinessEmployees(data.busID, result => {
        res.send(result)
    })
})

//returns business table from database
app.post('/apiGetBusinesses', (req, res) => {
    getAllBusinesses(result => {
        res.send(result)
    })
})

//creates user and new business
app.post('/createOwnerAndBusiness', (req, res) => {
    let data = req.body
    if(serverLogs) console.log("Creating business and owner...")

    //create business first to get business id for employee creation
    getMaxBusID(maxID => {
        const newBusinessId = maxID + 1
        const values = [
            Number(data.EmpID),
            newBusinessId,
            data.BusinessName.trim(),
            Number(data.YearFounded),
            data.City.trim(),
            data.State.trim(),
            data.Address.trim()
        ]
        if(serverLogs) console.log("Business values: ", values)
        insertNewBusiness(values, result => {
            if(result == "ERROR") {
                res.send({result: "ERROR: Business Could Not Be Created"})
            }
            else {
                //Create user 
                const userValues = [
                    Number(data.EmpID),
                    newBusinessId,
                    data.EmpName.trim(),
                    data.EmpYear.trim(),
                    "Owner",
                    startingSalary
                ]
                if(serverLogs) console.log("User values: ", userValues)
                insertNewEmployee(userValues, innerRes => {
                    res.send({result: innerRes, emp: Number(data.EmpID), bus: newBusinessId})
                })
            }
        })
    })
})

// 'login' user
app.post('/loginUser', (req, res) => {
    let creds = req.body
    const values = [
        Number(creds.empID),
        Number(creds.busID)
    ]

    //querey for employee
    employeeExists(values, result => {
        let exist = result ? true : false
        res.send({result: exist})
    })

    
})

//create business post
app.post('/createBusiness', async (req, res) => {
    getMaxBusID(maxID => {
        const newBusinessId = maxID + 1
        const tempOwner = 2
        let data = req.body
        let values = [  tempOwner, 
                        newBusinessId, 
                        data.BusinessName.trim(), 
                        Number(data.YearFounded.trim()), 
                        data.City.trim(),
                        data.State.trim(),
                        data.Address.trim()
                    ]

        //Insert data into database
        insertNewBusiness(values, result => {
            console.log(result)
            res.sendFile('index.html', {root: __dirname + '/public'})  
        })    
    })
})

//Removes provided business from database
app.post('/removeBusiness', (req, res) => {
    let data = req.body
    const values = [Number(data.owner), Number(data.business)]
    deleteBusiness(values, result => {
        res.send({requestStatus: result})
    })

})

//Returns all employees in database
app.post('/getAllEmployees', (req, res) => {
    getEmployees(response => {
        res.json(response)
    })
})

//Adds employee to database 
app.post('/hireNewEmployee', (req, res) => {
    let data = req.body
    console.log(data)

    const values = [
        Number(data.EmpId),
        Number(data.BusId),
        data.Name,
        data.BirthYear, 
        data.position,
        Number(data.Salary)
    ]

    insertNewEmployee(values, result => {
        res.json(result)
    })
})

//Returns the max id of the provided business
app.post('/getBusMaxEmpId', (req, res) => {
    let busID = req.body.busID
    console.log(busID)

    getBusinessMaxEmpId(busID, result => {
        res.send({"maxID": result[0].maxID})
    })

})

//Removes provided employee from business
app.post('/fireEmployee', (req, res) => {
    let data = req.body
    console.log(data)
    const values = [
        data.EmpId,
        data.BusId
    ]

    removeEmployee(values, result => {
        res.send({"result": result})
    })

})

app.post('/getBusOwner', (req, res) => {
    let busID = req.body.businessID
    getOwnerId(busID, result => {
        res.send({"result": result})
    })
})

app.listen(port, () => {
    console.log('Express app listening on http://localhost:', port)
})
















/*===================
===Query functions===
====================*/

//Returns all business in database 
function getAllBusinesses(callback) {
    if(serverLogs) console.log("Pulling all business data")

    const querey = "select * from Business"
    dataCon.query(querey, (error, result) => {

        //log error if occured in server console
        if(error) console.log(error)

        let status = error ? 'error' : 'success'

        let toSend = JSON.stringify({
            status: status,
            data: result
        })
          
        callback(toSend)  
    })
}

//Sets param for callback to current max business id (null if errored)
function getMaxBusID(callback) {
    if(serverLogs) console.log("Finding max business id")
    dataCon.query('SELECT max(BusId) as maxID FROM Business', (error, result) => {
        if(error) console.log(error)
        error ? callback(null) : callback(result[0].maxID)
    })    
}

//Inserts new business into database
//puts success or error in callback based on database response
function insertNewBusiness(values, callback) {
    if(serverLogs) console.log("Adding new business(" + values[1] + ")")
    dataCon.query("INSERT INTO Business (OwnerId, BusId, BusName, Founded, City, State, Address) VALUES (?, ?, ?, ?, ?, ?, ?)", values, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback("SUCCESS")
    })
}

//Deletes provided buiness from database 
//puts success or error in callback based on database response
function deleteBusiness(values, callback) {
    if(serverLogs) console.log("Deleting business(" + values[1] + ")")
    dataCon.query("DELETE FROM Business WHERE OwnerId = ? AND BusId = ?", values, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback("SUCCESS")
    })
}

//checks if employee exists based on values provided
//puts success or error in callback based on database response
function employeeExists (values, callback) {
    if(serverLogs) console.log("Looking to see if business(" + values[1] + ") has employee(" + values[0] +")")
    dataCon.query("SELECT * FROM Employee WHERE EmpId = ? AND BusId = ?", values, (error, result) => {
        if(error) console.log(error)
        callback(result.length)
    })
}

//quereys employee table 
function getEmployees(callback) {
    if(serverLogs) console.log("Retreving all employees")
    dataCon.query("SELECT * FROM Employee", (error, result) => {
        if(error) console.log(error)
        callback(result)
    })
}

//inserts new employee into database
//puts success or error in callback based on database response
function insertNewEmployee(values, callback) {
    if(serverLogs) console.log("Adding employee(" + values[0] +") to business(" + values[1] + ")")
    dataCon.query("INSERT INTO Employee (EmpId, BusId, Name, BirthYear, position, Salary) VALUES (?, ?, ?, ?, ?, ?)", values, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback("SUCCESS")
    })
}

//Retreives employees from provided business in database
function getBusinessEmployees(business, callback) { 
    if(serverLogs) console.log("Retreving all employees from business(" + business + ")")
    dataCon.query("SELECT * FROM Employee WHERE BusId = ?", business, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback(result)
    })
}

//Retrevies largest employee id of business 
function getBusinessMaxEmpId(business, callback) {
    if(serverLogs) console.log("Retreving highest employee id from business(" + business + ")")
    dataCon.query("SELECT max(EmpId) as maxID FROM Employee WHERE BusId = ?", business, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback(result)
    })
}

//Removes selected employee from selected business
function removeEmployee(values, callback) {
    if(serverLogs) console.log("Deleting employee(" + values[0] +") from business(" + values[1]+")")
    dataCon.query("DELETE FROM Employee WHERE EmpId = ? AND BusId = ?", values, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback("SUCCESS")
    })
}

//Returns business's owner id
function getOwnerId(business, callback) {
    if(serverLogs) console.log("Querying business(" + business + ") for its owner")
    dataCon.query("SELECT OwnerId FROM Business WHERE BusId = ?", business, (error, result) => {
        if(error) console.log(error)
        error ? callback("ERROR") : callback(result[0].OwnerId)
    })
}