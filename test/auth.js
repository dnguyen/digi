'use strict';
let chai = require('chai');
let expect = chai.expect;
let AuthService = require('../app/core/services/auth.js');

describe('Authentication Service', () => {
    let authService = new AuthService();

    describe('createToken()', () => {
        it('Should create a unique token for user id N1Giw7-zx', (done) => {
            authService.createToken('N1Giw7-zx').then(
                (token) => {
                    done();
                },
                (err) => {
                    done();
                });
        });
    });
});