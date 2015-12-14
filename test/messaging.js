'use strict';
let shortid = require('shortid');
let casual = require('casual');
let io = require('socket.io-client');
let options = {
    transports: ['websocket'],
    'force new connection': true
};
let HOST = 'http://localhost:3000';


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let client = io.connect(HOST, options);
let tokens = [
    'db02f915-ccdc-4192-8851-990f15532bb2',
    '8a5e91c4-9275-464d-b68e-a82978f684eb',
    'c95e5e96-391d-4992-9941-1cc67d2239f0',
    '6a9afe04-ee08-4bdb-b9e0-b956ea40ce15',
    '7cc8df3b-1157-4cd2-91b7-400516d77afb',
    'aad3fc64-6e9b-4453-8417-6046d23c1b94',
    '315a3e06-bbb6-43e8-9355-41ee5f30dc65'
];

for (var i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    client.emit('setupConnection', {
        token: token
    });

    let sendMessageInterval = getRandomIntInclusive(10000, 25000);

    setInterval(() => {
        client.emit('newGroupMessage', {
            token: token,
            group_id: 5,
            message: 'Test message from simulation. ' + shortid.generate()
        }, (data) => {
            console.log('acknowledged new message', data);
        });
    }, sendMessageInterval);
}