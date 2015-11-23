'use strict';
let http = require('http');
let AuthController = require('./controllers/auth.js');
let UsersController = require('./controllers/users.js');
let GroupsController = require('./controllers/groups.js');
let AccountController = require('./controllers/account.js');

class Api {
    constructor(app) {
        this.app = app;
        this.http = http.Server(app);
        this.startListening();
        this.setupRoutes();
    }

    startListening() {
        this.http.listen(3000, function(){
          console.log('listening on *:3000');
        });

        // For testing
        this.app.get('/', function(req, res){
            res.sendfile('index.html');
        });
    }

    setupRoutes() {
        this.app.use('/auth', AuthController);
        this.app.use('/account', AccountController);
        this.app.use('/users', UsersController);
        this.app.use('/groups', GroupsController);
    }
}

module.exports = Api;