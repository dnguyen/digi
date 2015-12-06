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
                         OPTIONAL MATCH group-[message:Posted_In]-(user_message)
                         RETURN group, collect(user) AS members, collect(user_message) AS messages`;
            let params = {
                group_id: group_id
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) { reject(new AppError(err)); }
                if (results.length) {
                    console.log(results[0]);
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
            database.query(`INSERT INTO Groups (name) VALUES (?)`, [name], (err, results) => {
                if (err) { return reject(new AppError('Failed to create group')); }
                if (results) {
                    database.query('SELECT * FROM GROUPS WHERE group_id = ?', [results.insertId], (err, group) => {
                        if (group) {
                            return resolve(group[0]);
                        } else {
                            return reject(new AppError('Could not find this group'));
                        }
                    })
                }
            });
        });

        return promise;
    }

    addMember(group_id, user_id) {
        console.log('adding member to', group_id, user_id);
        let promise = new Promise((resolve, reject) => {
            database.query('INSERT INTO Group_Members (group_id, user_id) VALUES (?, ?)', [group_id, user_id], (err, results) => {
                if (err) { return reject(new AppError('Failed to create group member')); }
                if (results) {
                    return resolve();
                } else {
                    return reject();
                }
            });
        });

        return promise;
    }
}

module.exports = GroupsService;
