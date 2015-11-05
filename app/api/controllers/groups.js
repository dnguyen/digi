'use strict';
let express = require('express');
let database = require('../../database.js');
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

    auth.getUser(token).then((creator) => {
        groups.create(groupName).then((group) => {
            groups.addMember(group.properties.group_id, creator).then((group) => {
                res.send(group);
            });
        });
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

    // TODO: Clean up callback hell...
    users.getByUsername(usernameBeingAdded).then((userBeingAdded) => {
        if (userBeingAdded) {
            auth.getUser(token).then((user) => {
                groups.getById(group_id).then((group) => {
                    group.isMember(user).then((isMember) => {
                        if (isMember) {
                            group.addMember(userBeingAdded).then((group) => {
                                res.send(group);
                            }).catch((err) => {
                                res.send('Failed to add member to group.');
                            });
                        }
                    }).catch((err) => {
                        res.status(500).send('User is not a member of this group.');
                    });
                }).catch((err) => {
                    res.status(500).send(err.message);
                });
            }).catch((err) => {
                res.send(err);
            });
        } else {
            res.send('Username does not exist.');
        }
    });

});

module.exports = router;