'use strict';
let Model = require('./model.js');

class Group extends Model {
    constructor(node) {
        super();
        this.properties = {
            group_id: node.properties.group_id,
            name: node.properties.name
        };
    }
}

module.exports = Group;