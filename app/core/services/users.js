'use strict';
let bcrypt = require('bcrypt');
let shortid = require('shortid');
let database = require('../../database.js');
let User = require('../models/user.js');

class UsersService {

    constructor() {

    }

    getById(user_id) {
        var promise = new Promise((resolve, reject) => {
            let query = `MATCH (user:User { user_id: {user_id}})
                         RETURN user`;
            let params = { user_id: user_id };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) return reject(new Error(err));
                if (results.length) {
                    return resolve(new User(results[0]['user']));
                } else {
                    return reject(new Error('User does not exist.'));
                }
            });
        });

        return promise;
    }

    /**
     * Determines whether a user exists by username
     */
    exists(username) {
        var promise = new Promise((resolve, reject) => {
            let query = `MATCH (user:User { username: {username}})
                        RETURN user`;
            let parameters = {
                username: username
            };

            database.cypher({
                query: query,
                params: parameters
            }, (err, results) => {
                if (err) {
                    new Error(err);
                }

                if (!results.length) {
                    resolve(false);
                } else {
                    let user = new User(results[0]['user']);
                    resolve(user);
                }

            });
        });

        return promise;
    }

    create(username, password) {
        var promise = new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    let query = `CREATE (user:User {
                                    user_id: { user_id },
                                    username: { username },
                                    password: { password} })
                                 RETURN user`;
                    let params = {
                        user_id: shortid.generate(),
                        username: username,
                        password: hashedPassword
                    };

                    database.cypher({
                        query: query,
                        params: params
                    }, (err, results) => {
                        if (err) { return reject(new Error(err)); }
                        return resolve(new User(results[0]['user']));
                    });
                });
            });
        });

        return promise;
    }
}

module.exports = UsersService;