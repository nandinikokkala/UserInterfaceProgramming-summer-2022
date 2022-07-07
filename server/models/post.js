var mongoose=require('mongoose');

var PostSchema = new mongoose.Schema({
    userId:{ type: String, required: true},
    postTittle:{ type: String, required: true},
    content:{ type: String, required: true},
    comments: [{ comment: String }],
});

module.exports = mongoose.model('post', PostSchema, 'posts');