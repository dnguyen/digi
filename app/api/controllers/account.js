'use strict';
let _ = require('lodash');
let express = require('express');
let database = require('../../database.js');
let AuthService = require('../../core/services/auth.js');
let UsersService = require('../../core/services/users.js');
let GroupsService = require('../../core/services/groups.js');

const router = express.Router();
const users = new UsersService();
const auth = new AuthService();
const groups = new GroupsService();

router.get('/', (req, res) => {
    let token = req.query.token;
    let scope = {};
    auth.getUser(token).then((user) => {
        scope.user = user;
        return users.getGroupsForUser(user.user_id);
    }).then((userGroups) => {
        scope.userGroups = userGroups;

        var getLastMessagePromises = [];
        _.each(userGroups, (group) => {
            getLastMessagePromises.push(groups.getLastMessage(group.group_id));
        });

        return Promise.all(getLastMessagePromises);
    }).then((lastMessages) => {
        _.each(lastMessages, (message) => {
            _.each(scope.userGroups, (userGroup) => {
                if (message.length > 0) {
                    if (userGroup.group_id === message[0].group_id) {
                        userGroup.last_message = message[0];
                    }
                }
            });
        });

        scope.user.groups = scope.userGroups;
        res.send(scope.user);
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    });
});

module.exports = router;
