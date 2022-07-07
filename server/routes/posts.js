var mongoose = require('mongoose');
var express = require('express'); 
var postRoute = express.Router();
var PostModel = require('../models/post');
const verifyToken = require('../middleware/verifyToken');

var query = process.env.DATABASE_URI
const db = (query);
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});

postRoute
    //list all posts
    .get('/', function(req, res) {
        PostModel.find(function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send(data);
            }
        });  
    })
    //get user post
    .post('/user',verifyToken, function(req, res) {
        PostModel.find({userId: req.body.userId},function(err, posts) {
            if(err){
                console.log(err);
            }
            else{
                console.log("User posts");
                res.send({ success: true, message: "User posts", posts});
            }
        });  
    })
    //save new post
    .post('/save', verifyToken, function(req, res) {
    
        var NewPost = new PostModel();
        //NewPost.postId = 1;
        NewPost.userId = req.body.userId;
        NewPost.postTittle = req.body.postTittle;
        NewPost.content = req.body.content;

        NewPost.save(function(err, data){
            if(err){
                console.log(error);
            }
            else{
                console.log('Saved new post',data );
                res.send({ success: true, message: "New post saved successfully", data});
            }
        });
    })
    //get post
    .post('/post', function(req, res) {
        PostModel.findOne({_id: req.body.postId}, 
        function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send({ success: true, message: "Post data", data});
            }
        });  
    })
    //Update post
    .post('/update', function(req, res) {

        PostModel.findByIdAndUpdate(req.body.id, 
        {postTittle:req.body.postTittle, content:req.body.content,}, function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send({ success: true, message: "Post Udated", data});   
            }
        });  
    })
    //Post deleted
    .delete('/delete', function(req, res) {
        console.log('Req body',req.body);
        PostModel.deleteOne({ _id: req.body.id}, 
        function(err, data) {
            if(err){
                console.log(err);
                res.status(401).send({ message: err.message });
            }
            else{
                res.send({ message: "Post Deleted"});
            }
        });  
    })

module.exports = postRoute;