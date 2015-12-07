'use strict';
let sockets = require('socket.io');
let events = require('../events.js');
let redis = require('../redis.js');
let AuthService = require('../core/services/auth.js');

const auth = new AuthService();

class Dispatcher {

    constructor(http) {
        this.http = http;
        this.io = sockets(http);
        this.setupEventHandling();
        this.io.on('connection', this.onConnection);
    }

    setupEventHandling() {
        events.on('api:newGroup', this.handleNewGroupCreated);
        events.on('api:addMember', this.handleGroupAddedMember);
        events.on('api:newGroupMessage', (data) => { this.handleNewGroupMessage.call(this, data); });
    }

    onConnection(socket) {
        console.log('[DISPATCHER] New socket connection.', socket.id);

        socket.on('disconnect', () => {
            console.log('[DISPATCHER] Socket disconnected', socket.id);
        });

        // Upon first connection, get any groups the user is part of
        // and join the socket room for each of those groups.
        socket.on('setupConnection', (data) => {
            console.log('[DISPATCHER] Received setupConnection');
            auth.getUser(data.token).then((user) => {
                return user.getGroups();
            }).then((user) => {
                user.properties.groups.forEach((group) => {
                    console.log('[DISPATCHER] Socket joining room', socket.id, group.group_id);
                    socket.join(group.group_id);
                });
            }).catch((err) => {
                console.log(err);
            });

        });

        socket.on('locationUpdate', (data) => {
            console.log('[DISPATCHER] Received locationUpdate', data);
            // data should contain: a valid session token, location coordinates
            // use session token to get user that is sending this update
            // Using User object get ids of all the groups the user is a member of
            // Find the socket io room for each of those rooms and broadcast locationUpdate message
            auth.getUser(data.token).then((user) => {

                // Update the user's last position in Redis
                redis.hmset('user_location:'+user.properties.user_id, [
                    'latitude', data.latitude,
                    'longitude', data.longitude
                ], (err, response) => {
                    if (err) console.log(err);
                   console.log('[REDIS] Set location for key user_location:'+user.properties.user_id, response);
                });

                return user.getGroups();
            }).then((user) => {
                user.properties.groups.forEach((group) => {
                    socket.broadcast.to(group.group_id).emit('locationUpdate', {
                        username: user.properties.username,
                        user_id: user.properties.user_id,
                        latitude: data.latitude,
                        longitude: data.longitude
                    });
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    handleNewGroupCreated(group) {
        console.log('[DISPATCHER] Handling api:newGroup event.');
    }

    handleGroupAddedMember(data) {
        console.log('[DISPATCHER] Handling api:addMember', data.group, data.user);
    }

    handleNewGroupMessage(data) {
        console.log('[DISPATCHER] Handling api:newGroupMessage', data.user_id, data.group_id, data.contents);
        this.io.to(data.group_id).emit('newGroupMessage', {
            user: {
                user_id: data.user_id,
                username: data.username
            },
            group: {
                group_id: data.group_id,
                name: data.name
            },
            message: {
                message_id: data.message_id,
                contents: data.contents,
                created_at: data.created_at
            }
        });
    }
}

module.exports = Dispatcher;