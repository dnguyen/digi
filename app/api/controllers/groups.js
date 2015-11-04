'use strict';
let express = require('express');
let database = require('../../database.js');
let AuthService = require('../../core/services/auth.js');
let GroupsService = require('../../core/services/groups.js');

const router = express.Router();
const groups = new GroupsService();
const auth = new AuthService();

/**
 * POST /groups
 * Creates a new group
 */
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
    let userBeingAdded = req.body.user_id;
    let token = req.body.token;

    // Need to check the following before adding the user to the group:
    // 1. User that is inviting the member has a valid token
    // 2. Is a member of group_id (only if the group is NOT empty)
    // 3. User being added is a valid user
    auth.getUser(token).then((user) => {
        groups.getById(group_id).then((group) => {
            res.send(group);
        }).catch((err) => {
            res.status(500).send(err.message);
        });
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;