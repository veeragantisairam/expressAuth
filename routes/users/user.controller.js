const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
// const secret = "sai";
const secret = require('../../config')


// const db = require('../../configuration/db.connection')
// const User = db.User;
const User = require('./usermodel');
const bcrypt = require('bcryptjs');



//get all

router.get('/', (req, res) => {
    User.find().then(user => { res.json(user) }).catch(err => { res.json(err) });
})

// get by id
router.get('/:id', (req, res) => {
    User.findById(req.params.id).then(user => { res.json(user) }).catch(err => { res.json(err) });
})

//create
router.post('/register', (req, res) => {
    // console.log(req.body)

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user)
            if (user.length >= 1) {
                return res.status(409).json({ message: "mail already exist" })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User(req.body)
                        if (req.body.password) {
                            user.password = hash;
                        }
                        //console.log(user);
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created",
                                    result
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        });

});

//update

router.post('/update/:id', (req, res) => {
    // const use = User.findById(req.params.id);
    // // validate
    // console.log(use);
    const boddy = req.body;
    if (req.body.password) {
        boddy.password = bcrypt.hashSync(req.body.password, 10);
    }
    User.findByIdAndUpdate(req.params.id, boddy).exec((err, result) => {
        User.findById(req.params.id).exec((err, result) => {
            res.send(200).json(result);
        })
    })

    // console.log(body);
    // User.findById(req.params.id).exec((err, result1) => {
    //     User.findOne((err, result2) => {
    //         console.log(result2);
    //     })
    //     console.log(result1)
    // })
});



//delete

router.delete('/:id', (req, res) => {

    User.findByIdAndDelete(req.params.id).exec((err, result) => {
        User.find().exec((err, result) => {
            res.status(200).json(result);
        })
    })


})

//login
router.post('/login', (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "login fail"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: "password incorrect" })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, secret, {
                        expiresIn: "15m"
                    });
                    return res.status(200).json({
                        message: "login success",
                        token: token
                    });
                }
                res.status(401).json({ message: "login fail" })
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                erroe: err
            })
        });
})

module.exports = router;