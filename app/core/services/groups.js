'use strict';
let _ = require('lodash');
let shortid = require('shortid');
let database = require('../../database.js');
let events = require('../../events.js');
let AppError = require('../utilities/error.js');

class GroupsService {

    constructor() {

    }

    getById(group_id) {
        let promise = new Promise((resolve, reject) => {
            // First get group data and members
            database.query(
                `SELECT G.group_id, G.name FROM Groups G WHERE G.group_id = ?`, [group_id], (err, results) => {
                    if (err) { return reject(err); }
                    if (results.length > 0) {

                        var returnObj = {
                            group_id: results[0].group_id,
                            name: results[0].name,
                            members: []
                        };

                        // Get Messages
                        database.query(
                            `SELECT M.message_id, M.user_id, U.username, M.contents, M.created_at FROM Messages M
                             JOIN Users U ON U.user_id = M.user_id
                             WHERE M.group_id = ?
                             ORDER BY M.created_at`, [group_id], (err, messages) => {
                                if (err) return reject(err);

                                // Get members
                                database.query(
                                    `SELECT U.user_id, U.username FROM Group_Members M
                                    JOIN Users U ON U.user_id = M.user_id WHERE M.group_id = ?`, [group_id],
                                    (err, results) => {
                                        var members = [];
                                        _.each(results, (row) => {
                                            members.push({ user_id: row.user_id, username: row.username });
                                        });

                                        returnObj.messages = messages;
                                        returnObj.members = members;

                                        return resolve(returnObj);
                                    });
                             });
                    } else {
                        return reject('No group by that id.');
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
                    database.query('SELECT * FROM Groups WHERE group_id = ?', [results.insertId], (err, group) => {
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

    isMember(group_id, user_id) {
        let promise = new Promise((resolve, reject) => {
            database.query('SELECT * FROM Group_Members WHERE group_id = ? AND user_id = ?', [group_id, user_id], (err, results) => {
                if (err) return reject(err);
                return resolve(results.length > 0);
            });
        });

        return promise;
    }

    addMessage(group_id, user_id, message) {
        let promise = new Promise((resolve, reject) => {
            database.query(`INSERT INTO Messages (group_id, user_id, contents, created_at) VALUES (?, ?, ?, NOW())`,
                [group_id, user_id, message], (err, results) => {
                    if (err) return reject(err);
                    database.query(
                        `SELECT U.user_id, U.username, G.group_id, G.name, M.message_id, M.contents, M.created_at FROM Messages M
                        JOIN Users U ON U.user_id = M.user_id
                        JOIN Groups G ON G.group_id = M.group_id
                        WHERE message_id = ?`, [results.insertId], (err, message) => {
                        if (err) return reject(err);
                        //events.emit('api:newGroupMessage', message[0]);
                        return resolve(message[0]);
                    });
                });
        });

        return promise;
    }
}

module.exports = GroupsService;
