'use strict';
let shortid = require('shortid');
let database = require('../../database.js');

class BadgesServices {
    constructor() {}

    /**
     * Properties of a badge:
     *  For each circle
     *      - Saturation [0-255] Int
     *      - Hue [0-255] Int
     *      - Brightness [0-255] Int
     *  Animation Type:
     *      - Cycle
     *      - Pulse
     */
    createBadge(user) {

    }

}

module.exports = BadgesServices;