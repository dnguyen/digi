'use strict';
let uuid = require('node-uuid');
let database = require('../../database.js');
let Token = require('../models/token.js');

class AuthService {

    /**
     * Create a unique session token for a user
     */
    createToken(user_id) {
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
                if (results.length) {
                    return resolve(new Token(results[0]['t']));
                }
            });
        });

        return promise;
    }
}

module.exports = AuthService;