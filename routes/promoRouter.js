const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send all promotions to you!");
    })
    .post((req, res, next) => {
        res.end(`"Will add the promotion: ${req.body.name} with details: ${req.body.description}`);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the promotions");
    });

promoRouter.route("/:promoId")
    .all((req, res, next)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
    })
    .get((req, res, next)=>{
        res.end(`will send promotion with id: ${req.params.promoId}`)
    })
    .post((req, res, next)=>{
        res.statusCode = 403;
        res.end(`POST operation not allowed on /promotions/${req.params.promoId}`)
    })
    .put((req, res, next) => {
        res.end(`Updating with promotion: ${req.params.promoId}\n will update the promotion: ${req.params.name} with details: ${req.params.description}`);
    })
    .delete((req, res, nex)=>{
        res.end(`Will delete promotion with ID: ${req.params.promoId}`)
    });

module.exports = promoRouter;