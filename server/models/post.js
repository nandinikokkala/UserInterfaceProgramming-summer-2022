var mongoose=require('mongoose');
var PostSchema = new mongoose.Schema({
    postId:Number,
    userId:Number,
    postTittle:String,
    content:String,
    comments: [{ comment: String }],
});
  
module.exports = mongoose.model('post', PostSchema, 'posts');