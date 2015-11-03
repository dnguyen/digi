var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var database = require('./database.js');
var Api = require('./api/app.js');
var Dispatcher = require('./dispatcher/app.js');

var ApiApp = new Api(app);
var DispatcherApp = new Dispatcher(ApiApp.http);
