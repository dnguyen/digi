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

    exists(username) {
        var promise = new Promise((resolve, reject) => {
            database.query('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
                if (err) { return reject(err); }
                if (user.length > 0) {
                    return reject(new AppError('User already exists.'));
                } else {
                    return resolve(true);
                }
            });
        });

        return promise;
    }

    getByUsername(username) {
        var promise = new Promise((resolve, reject) => {
            database.query('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
                if (err) { return reject(err); }
                if (user.length > 0) {
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
                                    return reject(new AppError('No user with that id.'));
                                }
                            });
                        });
                });
            });
        });

        return promise;
    }

    getGroupsForUser(user_id) {
        var promise = new Promise ((resolve, reject) => {
            database.query(
                `SELECT G.group_id, G.name,
                    (SELECT M.contents FROM Messages M WHERE G.group_id = M.group_id ORDER BY M.created_at DESC LIMIT 1)  AS last_message
                 FROM Group_Members GM
                 JOIN Groups G ON G.group_id = GM.group_id
                 WHERE user_id = ?`, [user_id], (err, results) => {
                    if (err) { return reject('Failed to find groups for user'); }
                    return resolve(results);
                 });
        });

        return promise;
    }
}

module.exports = UsersService;