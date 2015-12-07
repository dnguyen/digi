'use strict';
let neo4j = require('neo4j');
let mysql = require('mysql');

//let db = new neo4j.GraphDatabase('http://neo4j:123456@localhost:7474');
let db = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'digi'
});

module.exports = db;