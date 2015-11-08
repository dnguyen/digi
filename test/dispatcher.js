'use strict';
let io = require('socket.io-client');
let options = {
    transports: ['websocket'],
    'force new connection': true
};
let client = io.connect('http://localhost:3000', options);
let client2 = io.connect('http://localhost:3000', options);

client.on('locationUpdate', (data) => {
    console.log('locationUpdate for client1', data);
});

client2.on('locationUpdate', (data) => {
    console.log('locationUpdate for client2', data);
});

client.emit('setupConnection', {
    token: '85f04947-b5ed-44b4-aad6-7455114c7da1'
});

client2.emit('setupConnection', {
    token: '65e84784-91a6-4786-9164-26aa6f2d5fa5'
});

setInterval(() => {
    client.emit('locationUpdate', {
        token: '85f04947-b5ed-44b4-aad6-7455114c7da1',
        latitude: 1.2,
        longitude: 1.43
    });
}, 2000);