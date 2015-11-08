'use strict';
let shortid = require('shortid');
let database = require('../../database.js');
let events = require('../../events.js');
let AppError = require('../utilities/error.js');
let Model = require('./model.js');

class Group extends Model {
    constructor(node) {
        super();

        // Some queries will return just the group data. Others will include member data.
        // TODO: better solution.
        if (!node.properties) {
            this.properties = {
                group_id: node.group.properties.group_id,
                name: node.group.properties.name
            };
        } else {
            this.properties = {
                group_id: node.properties.group_id,
                name: node.properties.name
            };
        }
    }

    isMember(user) {
        let promise = new Promise((resolve, reject) => {
            let query = `MATCH (user:User { user_id: {user_id}})-[:Member_Of]-(group:Group { group_id: {group_id}})
                         RETURN user`;
            let params = {
                user_id: user.properties.user_id,
                group_id: this.properties.group_id
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) { reject(err); }
                if (results.length) {
                    resolve(true);
                } else {
                    reject(false);
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
    addMember(user) {
        let promise = new Promise((resolve, reject) => {
            let query = `MATCH (g:Group { group_id: {group_id}}),
                            (u:User { user_id: {user_id}})
                         CREATE u-[m:Member_Of]->g
                         RETURN g`;
            let params = {
                group_id: this.properties.group_id,
                user_id: user.properties.user_id
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) reject(new AppError(err));
                if (results) {
                    let group = new Group(results[0]['g'])
                    events.emit('api:addMember', { group: group, user: user });
                    resolve(group);
                }
            });
        });

        return promise;
    }

    addMessage(user, message) {
        let promise = new Promise((resolve, reject) => {
            let query = `MATCH (user:User { user_id: {user_id}})--(group:Group { group_id: {group_id}})
                         CREATE (user)-[:Created_Message]->(message:Message { message_id: {message_id}, contents: {contents}, created_at: timestamp()})-[:Posted_In]->(group)
                         return user, message, group`;
            let params = {
                user_id: user.properties.user_id,
                group_id: this.properties.group_id,
                message_id: shortid.generate(),
                contents: message
            };

            database.cypher({
                query: query,
                params: params
            }, (err, results) => {
                if (err) reject(new AppError(err));
                if (results) {
                    let message = results[0].message.properties;
                    let payload = {
                        user: results[0].user.properties,
                        group: results[0].group.properties,
                        message: message
                    };
                    events.emit('api:newGroupMessage', payload);
                    resolve(message);
                } else {
                    reject(new AppError('Failed to create new message'));
                }
            });
        });

        return promise;
    }

}

module.exports = Group;