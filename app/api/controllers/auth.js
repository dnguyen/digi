'use strict';
let express = require('express');
let database = require('../../database.js');
let AuthService = require('../../core/services/auth.js');

const router = express.Router();
const auth = new AuthService();

router.post('/', (req, res) => {
    auth.authenticate(req.body.username, req.body.password)
    .then((token) => {
        res.send(token);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

router.delete('/', (req, res) => {
    let token = req.body.token;
    auth.deleteToken(token).then(() => {
        res.send();
    }).catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;
