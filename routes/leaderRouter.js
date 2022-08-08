const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send all leaders to you!");
    })
    .post((req, res, next) => {
        res.end(`"Will add the leader: ${req.body.name} with details: ${req.body.description}`);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /leaders");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the leaders");
    });

leaderRouter.route("/:leaderId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
    })
    .get((req, res, next) => {
        res.end(`will send leader with id: ${req.params.leaderId}`)
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not allowed on /leaders/${req.params.leaderId}`)
    })
    .put((req, res, next) => {
        res.end(`Updating with leader: ${req.params.leaderId}\n will update the leader: ${req.params.name} with details: ${req.params.description}`);
    })
    .delete((req, res, nex) => {
        res.end(`Will delete leader with ID: ${req.params.leaderId}`)
    });

module.exports = leaderRouter;