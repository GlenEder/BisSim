const express = require('express')
const app = express()
const port = 3000

//init database 
const mysql = require('mysql')
const dataCon = mysql.createConnection({
    host: '34.123.177.22',
    user: 'root', 
    password: 'CS348_pass',
    database: 'cs348project'
})

//attempt connection to database 
dataCon.connect(err => {
    if(err) throw err

    console.log("Connected to database")
})

//use pulblic folder to send files from 
app.use(express.static('public'))

//send landing page to user
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(port, () => {
    console.log('Express app listening on http://localhost:', port)
})