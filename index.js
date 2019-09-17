const express = require('express');
const app = express();
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

const portnum = 3003;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/userDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Successfully connected');

});

mongoose.Promise = global.Promise;


app.use('/authenticate', require('./routes/users/user.controller'));
app.use('/books', require('./routes/books/bookscontroller'))


app.get('/', (req, res) => {
    res.send('welcome');
});

app.listen(portnum, () => {
    console.log(`server listening port number at : ${portnum}`);
})

// https://www.youtube.com/watch?v=0D5EEKH97NA