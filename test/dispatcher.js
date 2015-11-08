'use strict';
let chai = require('chai');
let expect = chai.expect;
let io = require('socket.io-client');

describe('Dispatcher', () => {
    let client = io.connect('http://localhost:3000', {});
    it('Should setup a connection', (done) => {
        client.emit('setupConnection', {
            token: '85f04947-b5ed-44b4-aad6-7455114c7da1'
        });
        //client.disconnect();
        //done();
    });
});