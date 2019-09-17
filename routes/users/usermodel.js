var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserCollection = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: Number,
    createdDate: { type: Date, default: Date.now }
});

var userModel = mongoose.model('users', UserCollection);
module.exports = userModel;