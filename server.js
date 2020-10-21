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
    res.sendFile('index.html')
})

//test post 
app.post('/apiGetBusinesses', (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
    console.log('Express app listening on http://localhost:', port)
})