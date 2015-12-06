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
            database.query('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
                if (err) { return reject(err); }
                if (user) {
                    return resolve(user[0]);
                } else {
                    return reject(new AppError('Username does not exist'));
                }
            });
        });

        return promise;
    }

    create(username, password) {
        var promise = new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    database.query('INSERT INTO Users (username, password) VALUES (?, ?)',
                        [username, hashedPassword], (err, results) => {
                            database.query('SELECT user_id, username FROM Users WHERE user_id = ?', [results.insertId], (err, user) => {
                                if (user) {
                                    return resolve(user[0]);
                                } else {
                                    return reject({ error: 'No user with that id.'});
                                }
                            });
                        });
                });
            });
        });

        return promise;
    }
}

module.exports = UsersService;