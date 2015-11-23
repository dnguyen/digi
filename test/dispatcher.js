'use strict';
let io = require('socket.io-client');
let options = {
    transports: ['websocket'],
    'force new connection': true
};
let HOST = 'http://localhost:3000';

let client = io.connect(HOST, options);
let client1 = io.connect(HOST, options);
let token1 = 'af3202a6-0471-4d19-bbb7-82e8f396da7a'
// let client2 = io.connect('http://localhost:3000', options);

client.on('locationUpdate', (data) => {
    console.log('locationUpdate for client1', data);
});

// client2.on('locationUpdate', (data) => {
//     console.log('locationUpdate for client2', data);
// });

client.emit('setupConnection', {
    token: '2e125742-a6aa-4d51-9768-f643f21b1f8e'
});

client.emit('setupConnection', {
    token: token1
});

// client2.emit('setupConnection', {
//     token: '65e84784-91a6-4786-9164-26aa6f2d5fa5'
// });

setInterval(() => {
    client.emit('locationUpdate', {
        token: '2e125742-a6aa-4d51-9768-f643f21b1f8e',
        latitude: 40.798064,
        longitude: -77.861363
    });

    setTimeout(() => {

        client.emit('locationUpdate', {
            token: '2e125742-a6aa-4d51-9768-f643f21b1f8e',
            latitude: 40.798374,
            longitude: -77.863473
        });
    }, 2000);
}, 4000);

setInterval(() => {
    client.emit('locationUpdate', {
        token: token1,
        latitude: 40.798064,
        longitude: -77.860763
    });

    setTimeout(() => {

        client.emit('locationUpdate', {
            token: token1,
        latitude: 40.798064,
        longitude: -77.861363
        });
    }, 1000);
}, 2000);