'use strict';

class AppError {
    constructor(message) {
        this.message = message;
        console.log('[ERROR]', this.message);
    }
}

module.exports = AppError;