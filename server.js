const express = require('express')
const app = express()
const port = 3000

//use pulblic folder to send files from 
app.use(express.static('public'))

//send landing page to user
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(port, () => {
    console.log('Express app listening on http://localhost:', port)
})