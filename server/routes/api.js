const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const Video = require('../models/video')
const Special = require ('../models/special')
const jwt = require('jsonwebtoken')

//declaring database string
const db ="mongodb://localhost:27017/newJwt"
mongoose.connect(db , err =>{
    if (err){
      console.log('Error1'+err)
    }
    else{
      console.log('Connected to mongodb succesfully')
    }
  })

//get request
router.get('/Videos',(req,res) => {
    console.log('Get request for all videos')
    Video.find({})
    .exec(function(err,videos){
        if(err){
            console.log('Error retriving videos')
        }else{
            res.json(videos)
        }
    })
  })

  router.get('/Videos/:id',(req,res) => {
    console.log('Get request for single video')
    Video.findById(req.params.id)
    .exec(function(err,videos){
        if(err){
            console.log('Error retriving videos')
        }else{
            res.json(videos)
        }
    })
  })

  //get request for special
router.get('/Specials',(req,res) => {
  console.log('Get request for all special videos')
  Special.find({})
  .exec(function(err,specials){
      if(err){
          console.log('Error retriving videos')
      }else{
          res.json(specials)
      }
  })
})

//handling the post request to end point post video api
router.post('/video',(req,res)=>{
    console.log('post a video')
    var newVideo = new Video();
    newVideo.title = req.body.title
    newVideo.url = req.body.url
    newVideo.description = req.body.description
    newVideo.save((error,insertedVideo)=>{
      if(error){
        console.log('error saving video')
      }else{
        res.status(200).send(insertedVideo)
      }
    })
  })
  //handling the post request to end point post special api
router.post('/special',(req,res)=>{
  console.log('post a video')
  var newSpecial = new Special();
  newSpecial.title = req.body.title
  newSpecial.url = req.body.url
  newSpecial.description = req.body.description
  newSpecial.save((error,insertedVideo)=>{
    if(error){
      console.log('error saving video')
    }else{
      res.status(200).send(insertedVideo)
    }
  })
})

  //handling the post request to end point register API
router.post('/register',(req,res)=>{
    //extracting data at end point
    let userData =req.body
    //moongose model for mongodb
    let user = new User(userData)
    user.save((error,registeredUser)=>{
      if(error){
        console.log(error)
      }else{
        //payload is the object contains the id 
        let payload = {subject:registeredUser._id}
        //generating the token
        let token = jwt.sign(payload,'secret')
        //now sending token as an object
        res.status(200).send({token})
      }
    })
  })

  //handling the post request to end point login API
router.post('/login',(req,res)=>{
    //extracting data at login
    let userData = req.body
    //check for the email registered or not
    User.findOne({email:userData.email},(error,user)=>{
      if(error){
        console.log(error)
      }else{
        if(!user){
          res.status(401).send('Invalid Email')
        }else
        if(user.password !== userData.password){
          res.status(401).send('Invalid password')
        }else{
          //payload is the object contains the id 
          let payload = {subject:user._id}
          //generating the token
            let token = jwt.sign(payload,'secret')
            //now sending token as an object
            res.status(200).send({token})
        }
      }
      
    })
  })

  //checking the token is present or not
  function verifyToken(req,res,next){
    if(!req.headers.authorization){
      return res.status(401).send('UnAuthorozed')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
      return res.status(401).send('UnAuthorozed')
    }
    let payload = jwt.verify(token,'secret')
    if(!payload){
      return res.status(401).send('UnAuthorozed')
    }
    req.userId = payload.subject
    next()
  }

//finally exporting the router
module.exports = router   