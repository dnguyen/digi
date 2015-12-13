'use strict';
let express = require('express');
let database = require('../../database.js');
let UsersService = require('../../core/services/users.js');
let BadgesService = require('../../core/services/badges.js');

const router = express.Router();
const users = new UsersService();
const badges = new BadgesService();

router.get('/', (req, res) => {
    res.send('<h1>Users</h1>');
});

/**
 * POST /users
 * Creates a new user
 * Body:
 *     username - string
 *     password - string
 */
router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    users.exists(username).then((exists) => {
    }).then(() => {
        return users.create(username, password);
    }).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;