'use strict';
let neo4j = require('neo4j');

let db = new neo4j.GraphDatabase('http://neo4j:123456@localhost:7474');

module.exports = db;