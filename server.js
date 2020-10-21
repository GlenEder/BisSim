const express = require('express')
const app = express()
const port = 3000

//init database 
const mysql = require('mysql')
const dataCon = mysql.createConnection({
    host: '35.184.255.168',
    user: 'root', 
    password: 'testpass',
    database: 'test'
})


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
    dataCon.connect(err => {
        if(err) throw err
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
})

app.listen(port, () => {
    console.log('Express app listening on http://localhost:', port)
})