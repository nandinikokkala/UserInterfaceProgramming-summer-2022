var mongoose = require('mongoose');
var express = require('express'); 
var postRoute = express.Router();
var PostModel = require('../models/post');
  
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
    //save new post
    .post('/save', function(req, res) {
    
        var NewPost = new PostModel();
        NewPost.postId = req.body.postId;
        NewPost.userId = req.body.userId;
        NewPost.postTittle = req.body.postTittle;
        NewPost.content = req.body.content;
    
        NewPost.save(function(err, data){
            if(err){
                console.log(error);
            }
            else{
                res.send({ success: true, message: "Post Saved", data});
            }
        });
    })
    //get post
    .post('/post', function(req, res) {
        PostModel.findOne({postId: req.body.postId}, 
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
        PostModel.remove({postId: req.body.postId}, 
        function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send({ success: true, message: "Post Deleted", data});
            }
        });  
    })

module.exports = postRoute;