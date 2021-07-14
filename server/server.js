const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//importing the routes api

const api = require('./routes/api')

//definif port for express server
const PORT = 3000

//instance for express server
const app = express()
app.use(cors())

//to handle json data we use bodyParser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//using api route
app.use('/api',api)

//get request from server
app.get('/',function(req,res){
    res.send('Hello from server at port 3000')
})


console.log('Please Wait.......')
//listening to the request on specific port
app.listen(PORT,function(){
    console.log('server is online at port:'+PORT)
})