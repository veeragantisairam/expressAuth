const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Books = require('./booksmodel');

router.get('/', authCheck, (req, res) => {
    Books.find().then(books => { res.json(books) }).catch(err => { res.json(err) });
})

router.post('/create', authCheck, (req, res) => {
    var book = new Books(req.body)
    book.save((err, result) => {
        res.status(200).json(result);
    });
})

router.put('/update/:id', authCheck, (req, res) => {
    Books.findByIdAndUpdate(req.params.id, req.body).exec((err, result) => {
        if (err) throw err;
        Books.findById(req.params.id).exec((err, result) => {
            res.status(200).json(result);
        })
    })
})

router.delete('dele/:id', authCheck, (req, res) => {
    Books.findByIdAndDelete(req.params, id).exec((err, result) => {
        if (err) throw err;
        Books.find().exec((err, result) => {
            res.status(200).json(result);
        })
    })
})

module.exports = router;