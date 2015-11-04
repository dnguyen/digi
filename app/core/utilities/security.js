'use strict';
let bcrypt = require('bcrypt');

let SecurityUtility = {
    createHash: (input) => {
        let promise = new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(input, salt, (err, hashedPassword) => {
                    return resolve(hashedPassword)
                });
            });
        });

        return promise;
    },

    match: (plain, hash) => {
        let promise = new Promise((resolve, reject) => {
            bcrypt.compare(plain, hash, (err, res) => {
                if (err) { reject(err); }
                resolve(res);
            });
        });

        return promise;
    }
};

module.exports = SecurityUtility;