'use strict';
var Model = require('./model.js');

class User extends Model {
    constructor(node) {
        super();

        this.hidden = {
            password: true
        };

        this.properties = {
            user_id: node.properties.user_id,
            username: node.properties.username,
            password: node.properties.password
        };
    }
}

module.exports = User;