'use strict';
let BadgeService = require('../app/core/services/badges.js');

let badges = new BadgeService();

let badge = badges.create({});
console.log(JSON.stringify(badge));