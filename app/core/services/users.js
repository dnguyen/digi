'use strict';
let bcrypt = require('bcrypt');
let shortid = require('shortid');
let database = require('../../database.js');
let AppError = require('../utilities/error.js');
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
                if (err) return reject(new AppError(err));
                if (results.length) {
                    return resolve(new User(results[0]['user']));
                } else {
                    return reject(new AppError('User does not exist.'));
                }
            });
        });

        return promise;
    }

    getByUsername(username) {
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
                if (err) { reject(new Error(err)); }
                if (results.length) {
                    resolve(new User(results[0]['user']));
                } else {
                    reject(new AppError('Username does not exist'));
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
                        if (err) { return reject(new AppError(err)); }
                        return resolve(new User(results[0]['user']));
                    });
                });
            });
        });

        return promise;
    }
}

module.exports = UsersService;