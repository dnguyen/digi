'use strict';
let io = require('socket.io-client');
let options = {
    transports: ['websocket'],
    'force new connection': true
};
let HOST = 'http://localhost:3000';

let client = io.connect(HOST, options);
let token = 'db02f915-ccdc-4192-8851-990f15532bb2'

client.on('locationUpdate', (data) => {
    console.log('locationUpdate for client1', data);
});

// client2.on('locationUpdate', (data) => {
//     console.log('locationUpdate for client2', data);
// });

client.emit('setupConnection', {
    token: token
});

// client2.emit('setupConnection', {
//     token: '65e84784-91a6-4786-9164-26aa6f2d5fa5'
// });

setInterval(() => {
    client.emit('locationUpdate', {
        token: token,
        latitude: 40.798064,
        longitude: -77.861363
    });

    setTimeout(() => {

        client.emit('locationUpdate', {
            token: token,
            latitude: 40.798374,
            longitude: -77.863473
        });
    }, 2000);
}, 4000);