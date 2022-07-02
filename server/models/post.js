var mongoose=require('mongoose'),
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);
var PostSchema = new mongoose.Schema({
    //postId:Number,
    userId:Number,
    postTittle:String,
    content:String,
    comments: [{ comment: String }],
});

PostSchema.plugin(autoIncrement.plugin, { model: 'post', field: 'postId' });

module.exports = mongoose.model('post', PostSchema, 'posts');