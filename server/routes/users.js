var mongoose = require('mongoose');
var express = require('express'); 
const { body, validationResult } = require('express-validator');
var userRoute = express.Router();
var UserModel = require('../models/user');

var query = process.env.DATABASE_URI
const db = (query);
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});

userRoute
    //list all users
    .get('/', function(req, res) {
        UserModel.find(function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send(data);
            }
        });  
    })
    //create new use
   .post('/register', function(req, res) {
    
    var NewUser = new UserModel();
    NewUser.userId = req.body.userId;
    NewUser.userName = req.body.userName;
    NewUser.email = req.body.email;
    NewUser.password = req.body.password;

    NewUser.save(function(err, data){
        if(err){
            console.log(error);
        }
        else{

            res.send({ success: true, message: "New user registered", data});
        }
    });
})

//get user
.post('/user', function(req, res) {
    UserModel.findOne({email: req.body.email}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send({ success: true, message: "User Data", data});
        }
    });  
})
//Delete user
.delete('/delete', function(req, res) {
    UserModel.remove({email: req.body.email}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send({ success: true, message: "User Deleted", data});
        }
    });  
})
//update user
.post('/update', function(req, res) {
    
    UserModel.findByIdAndUpdate(req.body.id, 
    {userName:req.body.userName, email:req.body.email,}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send({ success: true, message: "User Updated", data});   
        }
    });  
})

module.exports = userRoute;