'use strict';
let uuid = require('node-uuid');
let database = require('../../database.js');
let security = require('../utilities/security.js');
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
                security.match(password, user.properties.password).then((matched) => {
                    if (matched === true) {
                        this.createToken(user.properties.user_id).then((token) => {
                            resolve(token);
                        }).catch((err) => {
                            reject(err);
                        });
                    } else {
                        reject(new Error('Invalid username or password.'));
                    }
                });
            }).catch((err) => {
                reject(new Error('Invalid username or password.'));
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
            let query = `MATCH (t:Token)-[:Session]-(user)
                         WHERE t.token = {token}
                         RETURN user`
            let params = {
                token: token
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) { return reject(new Error(err)); }
                if (results.length) {
                    console.log(results);
                    return resolve(new User(results[0]['user']));
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
            let query = `MATCH (u:User {user_id: {user_id }})
                         CREATE (t:Token { user_id: {user_id}, token: {token}})<-[s:Session]-(u)
                         RETURN t`;
            let params = {
                user_id: user_id,
                token: uuid.v4()
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) return reject(new Error(err));
                console.log(results);
                if (results.length) {
                    return resolve(new Token(results[0]['t']));
                } else {
                    return reject(new Error(results));
                }
            });
        });

        return promise;
    }
}

module.exports = AuthService;