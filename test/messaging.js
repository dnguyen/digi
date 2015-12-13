'use strict';
let shortid = require('shortid');
let io = require('socket.io-client');
let options = {
    transports: ['websocket'],
    'force new connection': true
};
let HOST = 'http://localhost:3000';

let client = io.connect(HOST, options);
let token = 'db02f915-ccdc-4192-8851-990f15532bb2';
client.emit('setupConnection', {
    token: token
});

setInterval(() => {
    client.emit('newGroupMessage', {
        token: token,
        group_id: 5,
        message: 'Test message from simulation. ' + shortid.generate()
    }, (data) => {
        console.log('acknowledged new message', data);
    });
}, 10000);