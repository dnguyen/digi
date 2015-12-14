'use strict';
let uuid = require('node-uuid');
let database = require('../../database.js');
let security = require('../utilities/security.js');
let AppError = require('../utilities/error.js');
let Token = require('../models/token.js');
let UserService = require('./users.js');
let User = require('../models/user.js');

const users = new UserService();

class AuthService {

    /**
     * Authenticates a username and password
     * @param  {string} username Username
     * @param  {string} password Password
     * @return {Token}  Returns a new token
     */
    authenticate(username, password) {
        var promise = new Promise((resolve, reject) => {
            users.getByUsername(username).then((user) => {
                security.match(password, user.password).then((matched) => {
                    if (matched === true) {
                        this.createToken(user.user_id).then((token) => {
                            resolve(token);
                        }).catch((err) => {
                            reject(new AppError(err));
                        });
                    } else {
                        reject(new AppError('Invalid username or password.'));
                    }
                });
            }).catch((err) => {
                reject(new AppError('Invalid username or password.'));
            });
        });

        return promise;
    }

    /**
     * Get a user from a token
     * @param  {string} token - Unique session token associated with a single user
     * @return {User}
     */
    getUser(token) {
        let promise = new Promise((resolve, reject) => {
            database.query(
                `SELECT U.user_id, U.username FROM Tokens T
                JOIN Users U ON U.user_id = T.user_id
                WHERE token = ?`,
            [token], (err, user) => {
                if (err) { return reject(new AppError(err)); }
                if (user) {
                    return resolve(user[0]);
                } else {
                    return reject(new AppError('User does not exist'));
                }
            });
        });
        return promise;
    }

    /**
     * Create a unique session token for a user
     */
    createToken(user_id) {
        console.log('creating token for', user_id);
        let promise = new Promise((resolve, reject) => {
            let token = uuid.v4();
            database.query('INSERT INTO Tokens (token, user_id) VALUES (?, ?)', [token, user_id], (err, results) => {
                if (err) return reject(new AppError('Failed to create token'));
                database.query('SELECT * FROM Tokens WHERE token = ?', [token], (err, token) => {
                    if (err) return reject(new AppError('Failed to find token'));
                    if (token) {
                        return resolve(token[0]);
                    } else {
                        return reject(new AppError('failed to find tokne'));
                    }
                });

            });
        });

        return promise;
    }

    deleteToken(token) {
        let promise = new Promise((resolve, reject) => {
            database.query('DELETE FROM Tokens WHERE token = ?', [token], (err, result) => {
                if (err) return reject(err);
                return resolve();
            });
        });

        return promise;
    }
}

module.exports = AuthService;