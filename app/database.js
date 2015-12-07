'use strict';
let neo4j = require('neo4j');
let mysql = require('mysql');

//let db = new neo4j.GraphDatabase('http://neo4j:123456@localhost:7474');
let db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'digi'
});

module.exports = db;