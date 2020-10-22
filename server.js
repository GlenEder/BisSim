const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()

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
    res.sendFile('index.html', {root: __dirname + '/public'})
})

//send create business page
app.get('/createBusiness', (req, res) => {
    console.log("Sending create busines page")
    res.sendFile('createBusiness.html', {root: __dirname + '/public'})  
})

//test post 
app.post('/apiGetBusinesses', (req, res) => {
    console.log("Querying database for BUSINESSES")

    const querey = "select BusName from Business"
    dataCon.query(querey, (error, result) => {
        let status = error ? 'error' : 'success'
        res.json({
            status: status,
            data: result
        })    
        
        //log error if occured in server console
        if(error) console.log(error)
    })
})


//create business post
app.post('/createBusiness', async (req, res) => {
    getMaxBusID(maxID => {
        const newBusinessId = maxID + 1
        const tempOwner = 2
        const query = "INSERT INTO Business (OwnerId, BusId, BusName, Founded, City, State, Address) VALUES (" +
                        tempOwner + "," +
                        newBusinessId + "," +
                        req.body.BusinessName.trim() + "," +
                        req.body.YearFounded.trim()  + "," +
                        req.body.City.trim()  + "," +
                        req.body.State.trim()  + "," +
                        req.body.Address.trim()  + ")"
        console.log(query)
        

    })
    //console.log(currMaxBusId)
    //res.send(req.body.BusinessName + " Created!")
})

app.listen(port, () => {
    console.log('Express app listening on http://localhost:', port)
})

/*===================
===Query functions===
====================*/

//Sets param for callback to current max business id (null if errored)
function getMaxBusID(callback) {
    dataCon.query('SELECT max(BusId) as maxID FROM Business', (error, result) => {
        error ? callback(null) : callback(result[0].maxID)
    })    
}