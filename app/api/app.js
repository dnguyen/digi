'use strict';
let http = require('http');
let UsersController = require('./controllers/users.js');

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
        this.app.use('/users', UsersController);
    }
}

module.exports = Api;