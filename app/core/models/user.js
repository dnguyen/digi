'use strict';
var Model = require('./model.js');

class User extends Model {
    constructor(node) {
        super();
        this.hidden = {
            password: true
        };
        this.properties = node.properties;
    }
}

module.exports = User;