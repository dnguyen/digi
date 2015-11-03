'use strict';
let express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('<h1>Users</h1>');
});

module.exports = router;