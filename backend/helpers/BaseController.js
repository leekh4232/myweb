const express = require("express");

class BaseController {
    #app;
    #router;
    static #current = null;

    constructor(app) {
        this.#app = app;
        this.#router = express.Router();
    }

    get router() {
        return this.#router;
    }

    get app() {
        return this.#app;
    }

    addRoute(method, url, cb) {
        this.#router[method](url, cb);
    }
}

module.exports = BaseController;
