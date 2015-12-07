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
    let scope = {};
    auth.getUser(token).then((user) => {
        scope.user = user;
        return users.getGroupsForUser(user.user_id);
    }).then((groups) => {

        res.send({
            user_id: scope.user.user_id,
            username: scope.user.username,
            groups: groups
        });
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
