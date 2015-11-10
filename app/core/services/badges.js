'use strict';
let shortid = require('shortid');
let database = require('../../database.js');

// Trait Probabilities
const HIGH_BRIGHTNESS_CHANCE = 15;

// Animation Types
const CYCLE = 0;
const PULSE = 1;

class BadgesServices {
    constructor() {}

    /**
     * Properties of a badge:
     *  For each circle
     *      - Hue [0-360] Int
     *      - Saturation [0-100] Int
     *      - Brightness [0-100] Int
     *  Animation Type:
     *      - Cycle
     *      - Pulse
     *  Animation Speed:
     *      - slow, medium, fast (values will be determined later)
     */
    createBadge(user) {
        let badge = {
            color: generateColor(),
            animation: generateAnimation()
        };

        console.log(badge);
        return badge;
    }

}

function generateColor() {
    let color = {
        hue: getRandomIntInclusive(0,360),
        saturation: getRandomIntInclusive(40,100),
        brightness: generateBrightness()
    };

    return color;
}

function generateBrightness() {
    let chance = getRandomIntInclusive(0, 100);
    if (chance < HIGH_BRIGHTNESS_CHANCE) {
        return getRandomIntInclusive(76,100);
    } else {
        return getRandomIntInclusive(40, 75);
    }
}

function generateAnimation() {
    let chance = getRandomIntInclusive(0, 100);
    if (chance < 50) {
        return CYCLE;
    } else {
        return PULSE;
    }

}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = BadgesServices;