'use strict';
let database = require('../../database.js');
let AppError = require('../utilities/error.js');
let Model = require('./model.js');

class User extends Model {
    constructor(node) {
        super();

        this.hidden = {
            password: true
        };

        this.properties = {
            user_id: node.properties.user_id,
            username: node.properties.username,
            password: node.properties.password,
            groups: []
        };
    }

    getGroups() {
        let promise = new Promise((resolve, reject) => {
            let query = `MATCH (user:User { user_id: {user_id}})-[:Member_Of]-(group)
                         RETURN user, collect(group) as groups`;
            let params = {
                user_id: this.properties.user_id
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) { reject(new AppError(err)); }
                if (results) {

                    this.properties.groups = [];
                    if (results.length > 0) {
                        let groups = results[0].groups;
                        groups.forEach((group) => {
                            this.properties.groups.push({
                                group_id: group.properties.group_id,
                                name: group.properties.name
                            });
                        });
                    }
                    resolve(this);
                } else {
                    reject(new AppError('Failed to get groups for user'));
                }
            });
        });

        return promise;
    }
}

module.exports = User;