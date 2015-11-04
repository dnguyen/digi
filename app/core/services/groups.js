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

    addMember(user) {

    }
}

module.exports = GroupsService;
