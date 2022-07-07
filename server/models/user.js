var mongoose=require('mongoose');

var UserSchema = new mongoose.Schema({
    userName:{ type: String, required: true},
    email:{ type: String, unique: true, required: true},
    password:{ type: String, required: true},
    refreshToken:String,
    userId:{ type: String, unique: true, required: true},
});
module.exports = mongoose.model('user', UserSchema, 'users');