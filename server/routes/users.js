var mongoose = require('mongoose');
var express = require('express'); 
var userRoute = express.Router();
var UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
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

        //check if user exist
        UserModel.exists({email: req.body.email}, function (err, exist) {
            if (err){
                console.log(err)
            }else{
                console.log("User exist :", exist) // true
                if(!exist){

                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                            }
                            else{ 
                                var NewUser = new UserModel();
                                //NewUser.userId = 1;
                                NewUser.userName = req.body.name;
                                NewUser.email = req.body.email;
                                NewUser.password = hash;
                                NewUser.refreshToken = null;    
                                NewUser.userId = req.body.email;
                                NewUser.save(function(err, data){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('User Registered');
                                        res.send({ success: true, message: "Registered successfully you can now login"});
                                    }
                                });
                            }
                        });
                    });

                }
                else{
                    res.send({ success: false, message: "Email already tacken please use a different one"});
                }
            }
        });
        
    })

    //login user
    .post('/login', function(req, res) {
    
        UserModel.findOne({email: req.body.email}, 
            function(err, user) {
                if(err){
                    console.log(err);
                }
                else{

                    if(!user){
                        console.log('User not registered');
                        res.status(404).send({ success: false, message: 'User not registered'});
                        return
                    }

                    bcrypt.compare(req.body.password, user.password, function(err, result) {
                        // result == true
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(result){
                                console.log('User signed in successfully', user);
                                const userId = user.userId;
                                const name = user.userName;
                                const email = user.email;
                                const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
                                    expiresIn: '20m'
                                });
                                const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
                                    expiresIn: '1d'
                                });
                                //update tocken
                                
                                UserModel.findOneAndUpdate({email: email}, 
                                    { refreshToken : refreshToken}, function(err, data) {
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            res.cookie('refreshToken', refreshToken,{
                                                httpOnly: true,
                                                maxAge: 24 * 60 * 60 * 1000
                                            }).send({ accessToken });
                                            return   
                                        }
                                    });    
                            }
                            else{
                                console.log('Invalid password');
                                res.status(404).json({ success: false, message: 'Invalid password'});
                                return
        
                            }
                        }
                    });

                }
        });  
        
    })

    //get refresh tocken
    .get('/token', function(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken) return res.sendStatus(401);

            UserModel.findOne({refreshToken: refreshToken}, 
                function(err, user) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(!user){
                            return res.sendStatus(403);
                        }
                        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                            if(err) return res.sendStatus(403);
                            const userId = user.userId;
                            const name = user.userName;
                            const email = user.email;
                            const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET);
                            res.json({ accessToken });
                        });

                    }
            });

        } catch (error) {
            console.log(error);
        }  
    })

    //logout
    .delete('/logout', function(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        UserModel.findOne({refreshToken: refreshToken}, 
            function(err, user) {
                if(err){
                    console.log(err);
                }
                else{
                    if(!user){
                        return res.sendStatus(204);
                    }
                    UserModel.findOneAndUpdate({email: user.email}, 
                        { refreshToken : null}, function(err, data) {
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("cookie cleared");
                                res.clearCookie('refreshToken');
                                return res.sendStatus(200);  
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
    .post('/delete', function(req, res) {
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