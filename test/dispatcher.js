'use strict';
let _ = require('lodash');
let io = require('socket.io-client');
let options = {
    transports: ['websocket'],
    'force new connection': true
};
let HOST = 'http://localhost:3000';
let baseLocation = {
    'longitude': -80.185223,
    'latitude': 25.774604
};

let group1Location = {
    'longitude': -80.186466,
    'latitude': 25.774604
};

let group2Location = {
    'longitude': -80.186006,
    'latitude': 25.773734,
}

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
]
//let token = 'db02f915-ccdc-4192-8851-990f15532bb2'

client.on('locationUpdate', (data) => {
    console.log('locationUpdate for client', data);
});
for (var i = 0; i < 4; i++) {
    let token = tokens[i];
    client.emit('setupConnection', {
        token: token
    });

    let locationUpdateTime = getRandomIntInclusive(2000, 5000);
    setInterval(() => {
        let latitudeModifier = getRandomIntInclusive(-100,100) / 1000000;
        let longitudeModifier = getRandomIntInclusive(-100,100)/1000000;
        client.emit('locationUpdate', {
            token: token,
            latitude: group1Location.latitude + latitudeModifier,
            longitude: group1Location.longitude + longitudeModifier
        })
    }, locationUpdateTime);
}

for (var i = 4; i < tokens.length; i++) {
   let token = tokens[i];
   client.emit('setupConnection', {
       token: token
   });

   let locationUpdateTime = getRandomIntInclusive(2000, 5000);
   setInterval(() => {
        let latitudeModifier = getRandomIntInclusive(-100,100) / 1000000;
        let longitudeModifier = getRandomIntInclusive(-100,100)/1000000;
        client.emit('locationUpdate', {
            token: token,
            latitude: group2Location.latitude + latitudeModifier,
            longitude: group2Location.longitude + longitudeModifier
        })
   }, locationUpdateTime);
}