'use strict';
let chai = require('chai');
let expect = chai.expect;
let User = require('../app/core/models/user.js');

describe('User Model', () => {

    let user = new User({ properties: {
        user_id: 'N1Giw7-zx',
        username: 'dnguyen3',
        password: '$2a$10$nERbl1XdJq5FgJb3NBEukOE57Ak5A4UKCW8tpjqPVThbmKly6mowW'
    }});

    describe('Initialization', () => {
        it('Should return User object given a neo4j node.', () => {
            expect(user).to.be.a('object');
            expect(user.properties).to.be.a('object');
            expect(user.properties.user_id).to.equal('N1Giw7-zx');
            expect(user.properties.username).to.equal('dnguyen3');
            expect(user.properties.password).to.equal('$2a$10$nERbl1XdJq5FgJb3NBEukOE57Ak5A4UKCW8tpjqPVThbmKly6mowW');
        });
    })

    describe('toJSON()', () => {
        it('Should return properties list excluding properties that are in hidden.', () => {
            let userJsonObject = user.toJSON();
            let jsonString = JSON.stringify(userJsonObject);

            expect(userJsonObject).to.be.a('object');
            expect(jsonString).to.equal('{"user_id":"N1Giw7-zx","username":"dnguyen3","groups":[]}');
        });
    })
});