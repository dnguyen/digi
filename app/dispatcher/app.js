'use strict';
let sockets = require('socket.io');
let events = require('../events.js');
let AuthService = require('../core/services/auth.js');

const auth = new AuthService();

class Dispatcher {

    constructor(http) {
        this.http = http;
        this.io = sockets(http);
        this.setupEventHandling();
        this.io.on('connection', this.onConnection);
    }

    setupEventHandling() {
        events.on('api:newGroup', this.handleNewGroupCreated);
        events.on('api:addMember', this.handleGroupAddedMember);
    }

    onConnection(socket) {
        console.log('[DISPATCHER] New socket connection.', socket.id);

        socket.on('disconnect', () => {
            console.log('[DISPATCHER] Socket disconnected', socket.id);
        });

        // Upon first connection, get any groups the user is part of
        // and join the socket room for each of those groups.
        socket.on('setupConnection', (data) => {
            console.log('[DISPATCHER] Recieved setupConnection');
            auth.getUser(data.token).then((user) => {
                return user.getGroups();
            }).then((user) => {
                user.properties.groups.forEach((group) => {
                    console.log('[DISPATCHER] Socket joining room', group.group_id);
                    socket.join(group.group_id);
                });
            }).catch((err) => {
                console.log(err);
            });

        });

        socket.on('locationUpdate', (data) => {
            // data should contain: a valid session token, location coordinates
            // use session token to get user that is sending this update
            // Using User object get ids of all the groups the user is a member of
            // Find the socket io room for each of those rooms and broadcast locationUpdate message
        });
    }

    handleNewGroupCreated(group) {
        console.log('[DISPATCHER] Handling api:newGroup event.');
    }

    handleGroupAddedMember(data) {
        console.log('[DISPATCHER] Handling api:addMember', data.group, data.user);
    }
}

module.exports = Dispatcher;