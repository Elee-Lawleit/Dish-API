const express = require("express");
const bodyParser = require("body-parser");
const leaderModel = require("../models/leaderModel");
const authenticate = require("../authenticate")

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    leaderModel
      .find({})
      .then((leaders) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leaders);
      })
      .catch((error) => next(error));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .create(req.body)
      .then((leader) => {
        console.log("Leader created: ", leader);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      })
      .catch((error) => next(error));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .deleteMany({})
      .then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      })
      .catch((error) => next(error));
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    leaderModel
      .findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      })
      .catch((error) => next(error));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      })
      .catch((error) => next(error));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .findByIdAndDelete(req.params.leaderId)
      .then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      })
      .catch((error) => next(error));
  });

module.exports = leaderRouter;