'use strict';
let Model = require('./model.js');

class Token extends Model {
    constructor(node) {
        super();
        this.properties = {
            user_id: node.properties.user_id,
            token: node.properties.token
        };
    }
}

module.exports = Token;