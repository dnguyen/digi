'use strict';
var sockets = require('socket.io');

class Dispatcher {
    constructor(http) {
        this.http = http;
        this.io = sockets(http);

        this.io.on('connection', this.onConnection);
    }

    onConnection(socket) {
        console.log('[DISPATCHER] New socket connection.');

        // Upon first connection, get any gruops the user is part of
        // and join the socket room for each of those groups.

        socket.on('locationUpdate', (data) => {
            // data should contain: a valid session token, location coordinates
            // use session token to get user that is sending this update
            // dispatch location to all members of groups that the user is in
        });
    }
}

module.exports = Dispatcher;