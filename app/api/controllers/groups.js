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
    console.log('Creating group for ' + token + ' ' + groupName);
    auth.getUser(token).then((creator) => {
        scope.creator = creator;
        return groups.create(groupName);
    }).then((group) => {
        scope.group = group;
        return groups.addMember(group.group_id, scope.creator.user_id);
    }).then((group) => {
        res.send(scope.group);
    }).catch((err) => {
        res.send(err);
    });
});

router.get('/:group_id', (req, res) => {
    let group_id = req.params.group_id;
    let token = req.query.token;
    let scope = {};

    groups.getById(group_id).then((group) => {
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
        return groups.isMember(scope.group.group_id, scope.userBeingAdded.user_id);
    }).then((isMember) => {
        // Check if the user being added is already in the group or not
        if (!isMember) {
            return groups.addMember(scope.group.group_id, scope.userBeingAdded.user_id);
        } else {
            res.status(403).send('User is already in this group.');
        }
    }).then((group) => {
        res.send(group);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


/**
 * POST /groups/:group_id/messages
 * Creates a new message in the group
 */
router.post('/:group_id/messages', (req, res) => {
    let token = req.body.token;
    let message = req.body.message;
    let group_id = req.params.group_id;
    var scope = {};

    auth.getUser(token).then((user) => {
        return groups.addMessage(group_id, user.user_id, message);
    }).then((results) => {
        res.send(results);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;