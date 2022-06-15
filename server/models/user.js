var mongoose=require('mongoose');
var UserSchema = new mongoose.Schema({
    userId:Number,
    userName:String,
    email:String,
    password:String,
});
module.exports = mongoose.model('user', UserSchema, 'users');