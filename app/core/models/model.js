'use strict';

class Model {
    constructor() {
        this.hidden = {};
        this.properties = {};
    }

    toJSON() {
        var output = {};
        for (let propertyName in this.properties) {
            if (!this.hidden[propertyName]) {
                output[propertyName] = this.properties[propertyName];
            }
        }

        return output;
    }
}

module.exports = Model;