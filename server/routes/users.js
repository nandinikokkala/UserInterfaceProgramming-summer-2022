var mongoose = require('mongoose');
var express = require('express'); 
var userRoute = express.Router();
var UserModel = require('../models/user');
const { requireAuth } = require('../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        bcrypt.hash(req.body.password, +process.env.SALT_ROUNDS, function(err, hash) {
            if(err){
                console.log(err);
            }
            else{  
                NewUser.userId = req.body.userId;
                NewUser.userName = req.body.userName;
                NewUser.email = req.body.email;
                NewUser.password = hash;

                NewUser.save(function(err, data){
                    if(err){
                        console.log(error);
                    }
                    else{
                        res.send({ success: true, message: "New user registered", data});
                    }
                });
            }
        });
        
    })

    //login user
    .post('/login', function(req, res) {
    
        UserModel.findOne({email: req.body.email}, 
            function(err, data) {
                if(err){
                    console.log(err);
                }
                else{

                    if(!data){
                        res.send({ success: false, message: 'User not registered'});
                        return
                    }

                    bcrypt.compare(req.body.password, data.password, function(err, result) {
                        // result == true
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(result){

                                const token = jwt.sign( data, process.env.JWT_SECRET);
                                const user = { ...data, token };
                                res.send({ success: true,  message: 'User loggedin' , user});
                    
                            }
                            else{
                                res.send({ success: false, message: 'Invalid password'});
                                return
        
                            }
                        }
                    });

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