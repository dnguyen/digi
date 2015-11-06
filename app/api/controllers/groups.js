'use strict';
let express = require('express');
let database = require('../../database.js');
let events = require('../../events.js');
let AuthService = require('../../core/services/auth.js');
let GroupsService = require('../../core/services/groups.js');
let UsersService = require('../../core/services/users.js');

const router = express.Router();
const groups = new GroupsService();
const users = new UsersService();
const auth = new AuthService();

/**
 * POST /groups
 * Creates a new group
 */
router.post('/', (req, res) => {
    let token = req.body.token;
    let groupName = req.body.name;
    let scope = {};

    auth.getUser(token).then((creator) => {
        scope.creator = creator;
        return groups.create(groupName);
    }).then((group) => {
        return group.addMember(scope.creator);
    }).then((group) => {
        res.send(group);
    }).catch((err) => {
        res.send(err);
    });
});


/**
 * POST /groups/:group_id/members
 * Add a user to group_id
 */
router.post('/:group_id/members', (req, res) => {
    let group_id = req.params.group_id;
    let usernameBeingAdded = req.body.username;
    let token = req.body.token;
    let scope = {};

    users.getByUsername(usernameBeingAdded).then((userBeingAdded) => {
        return userBeingAdded;
    }).then((userBeingAdded) => {
        if (userBeingAdded) {
            scope.userBeingAdded = userBeingAdded;
            return groups.getById(group_id);
        } else {
            res.send('Username does not exist.');
        }
    }).then((group) => {
        scope.group = group;
        return auth.getUser(token);
    }).then((user) => {
        scope.user = user;
        return scope.group.isMember(user);
    }).then((isMember) => {
        if (isMember) {
            return scope.group.addMember(scope.userBeingAdded);
        } else {
            res.status(403).send('User is not in this group.');
        }
    }).then((group) => {
        res.send(group);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;