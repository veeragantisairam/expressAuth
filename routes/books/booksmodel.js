var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BooksCollection = new Schema({
    bookName: String,
    author: String,
    stockStatus: String,
    sellerAddress: {
        location: String,
        pincode: Number
    },
    createdDate: { type: Date, default: Date.now }
});

var bookModel = mongoose.model('books', BooksCollection);
module.exports = bookModel;