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
    users.create(req.body.username, req.body.password)
        .then((user) => {
            let badge = badges.create(user);
            res.send(user);
        }, (err) => {
            res.status(500).send({ message: 'Username already exists.' });
        });
});

module.exports = router;