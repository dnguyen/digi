var app = require('express')();
var Api = require('./api/app.js');
var Dispatcher = require('./dispatcher/app.js');

var ApiApp = new Api(app);
var DispatcherApp = new Dispatcher(ApiApp.http);
