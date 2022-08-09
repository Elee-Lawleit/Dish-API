const express = require("express");
const bodyParser = require("body-parser");

const promoModel = require("../models/promotionModel");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
    .get((req, res, next) => {
        promoModel.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotions);
            })
            .catch((error) => next(error));
    })
    .post((req, res, next) => {
        promoModel.create(req.body)
            .then((promotion) => {
                console.log("Promotion created: ", promotion);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotion);
            })
            .catch((error) => next(error));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions");
    })
    .delete((req, res, next) => {
        promoModel.deleteMany({})
            .then((result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
            })
            .catch((error) => next(error))
    });

promoRouter.route("/:promotionId")
    .get((req, res, next) => {
        promoModel.findById(req.params.promotionId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotion);
            })
            .catch((error) => next(error))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
    })
    .put((req, res, next) => {
        promoModel.findByIdAndUpdate(req.params.promotionId, { $set: req.body }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                console.log(promotion)
                res.json(promotion);
            })
            .catch((error) => next("Error in put", error))
    })
    .delete((req, res, next) => {
        promoModel.findByIdAndDelete(req.params.promotionId)
            .then((result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
            })
            .catch((error) => next(error))
    })

module.exports = promoRouter;