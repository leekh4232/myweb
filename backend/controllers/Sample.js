const BaseController = require("../helpers/BaseController");

class Sample extends BaseController {
    constructor(app) {
        super(app);
        this.addRoute("get", "/", this.index);
    }

    index(req, res) {
        res.send({msg: "Hello World!"});
    }
}

module.exports = app => new Sample(app).router;