'use strict';
let sockets = require('socket.io');
let events = require('../events.js');

class Dispatcher {
    constructor(http) {
        this.http = http;
        this.io = sockets(http);
        this.setupEventHandling();
        this.io.on('connection', this.onConnection);
    }

    setupEventHandling() {
        events.on('api:newGroup', this.handleNewGroupCreated);
    }

    onConnection(socket) {
        console.log('[DISPATCHER] New socket connection.');

        // Upon first connection, get any gruops the user is part of
        // and join the socket room for each of those groups.

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
}

module.exports = Dispatcher;