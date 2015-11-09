"use strict";
let redis = require('redis');
let client = redis.createClient();

client.on('error', (err) => {
    console.log('[REDIS]', err);
});

module.exports = client;