'use strict';
let shortid = require('shortid');
let database = require('../../database.js');
let events = require('../../events.js');
let AppError = require('../utilities/error.js');
let Group = require('../models/group.js');

class GroupsService {

    constructor() {

    }

    getById(group_id) {
        let promise = new Promise((resolve, reject) => {
            let query = `MATCH (group:Group { group_id: {group_id}})
                         OPTIONAL MATCH group-[member:Member_Of]-(user)
                         RETURN group, collect(user) AS members`;
            let params = {
                group_id: group_id
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) { reject(new AppError(err)); }
                if (results.length) {
                    resolve(new Group(results[0]));
                } else {
                    reject(new AppError('No group with that id'));
                }
            });
        });

        return promise;
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
                if (err) { return reject(new AppError(err)); }
                if (results.length) {
                    return resolve(new Group(results[0]['g']));
                }
            });
        });

        return promise;
    }
}

module.exports = GroupsService;
