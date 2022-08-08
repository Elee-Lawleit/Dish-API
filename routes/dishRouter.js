const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dishModel = require("../models/dishesModel");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
    .get((req, res, next) => {
        dishModel.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dishes);
            })
            .catch((error) => next(error));
    })
    .post((req, res, next) => {
        dishModel.create(req.body)
            .then((dish) => {
                console.log("Dish created: ", dish);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            })
            .catch((error) => next(error));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes");
    })
    .delete((req, res, next) => {
        dishModel.deleteMany({})
            .then((result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
            })
            .catch((error) => next(error))
    });

dishRouter.route("/:dishId")
    .get((req, res, next) => {
        dishModel.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            })
            .catch((error) => next(error))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
    })
    .put((req, res, next) => {
        dishModel.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            })
            .catch((error) => next(error))
    })
    .delete((req, res, next) => {
        dishModel.findByIdAndDelete(req.params.dishId)
            .then((result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
            })
            .catch((error)=> next(error))

    })

module.exports = dishRouter;