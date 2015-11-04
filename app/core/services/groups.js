'use strict';
let shortid = require('shortid');
let database = require('../../database.js');
let Group = require('../models/group.js');

class GroupsService {
    constructor() {

    }

    create(name) {
        let promise = new Promise((resolve, reject) => {
            let query = `CREATE (g:Group {
                            group_id: {group_id},
                            name: {name}
                        })
                        RETURN g`;
            let params = {
                group_id: shortid.generate(),
                name: name
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) { return reject(new Error(err)); }
                if (results.length) {
                    return resolve(new Group(results[0]['g']));
                }
            });
        });

        return promise;
    }

    /**
     * Add a User to a Group
     * @param {string} group_id [description]
     * @param {User} user     [description]
     */
    addMember(group_id, user) {
        let promise = new Promise((resolve, reject) => {
            let query = `MATCH (g:Group { group_id: {group_id}}),
                            (u:User { user_id: {user_id}})
                         CREATE u-[m:Member_Of]-g
                         RETURN m`;
            let params = {
                group_id: group_id,
                user_id: user.properties.user_id
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) return reject(new Error(err));
                if (results.length) {
                    return resolve(results[0]['m']);
                }
            });
        });

        return promise;
    }
}

module.exports = GroupsService;
