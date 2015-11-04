'use strict';
let express = require('express');
let database = require('../../database.js');
let AuthService = require('../../core/services/auth.js');
let GroupsService = require('../../core/services/groups.js');

const router = express.Router();
const groups = new GroupsService();
const auth = new AuthService();

router.post('/', (req, res) => {
    groups.create(req.body.name).then((group) => {
        res.send(group);
    });
});


/**
 * POST /groups/:group_id/members
 * Add a user to group_id
 */
router.post('/:group_id/members', (req, res) => {
    let group_id = req.params.group_id;
    let token = req.body.token;
    auth.getUser(token).then((user) => {

        res.send(user);
    }, (err) => {
        res.send(err);
    });
});

module.exports = router;