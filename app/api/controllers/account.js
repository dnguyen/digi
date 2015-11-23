'use strict';
let express = require('express');
let database = require('../../database.js');
let AuthService = require('../../core/services/auth.js');
let UsersService = require('../../core/services/users.js');

const router = express.Router();
const users = new UsersService();
const auth = new AuthService();

router.get('/', (req, res) => {
    let token = req.query.token;

    auth.getUser(token).then((user) => {
        return user.getGroups();
    }).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
