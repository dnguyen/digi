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
    }
}

module.exports = Dispatcher;