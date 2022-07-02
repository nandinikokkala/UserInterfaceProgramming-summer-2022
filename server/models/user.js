var mongoose=require('mongoose'),
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
var UserSchema = new mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    refreshToken:String
});
UserSchema.plugin(autoIncrement.plugin, { model: 'user', field: 'userId' });
module.exports = mongoose.model('user', UserSchema, 'users');