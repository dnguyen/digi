'use strict';
let express = require('express');
let database = require('../../database.js');
let UsersService = require('../../core/services/users.js');

const router = express.Router();
const users = new UsersService();

router.get('/', function(req, res) {
    res.send('<h1>Users</h1>');
});

router.post('/', function(req, res) {
    users.create(req.body.username, req.body.password)
        .then((user) => {
            res.send(user);
        }, (err) => {
            res.status(500).send({ message: 'Username already exists.' });
        });
});

module.exports = router;