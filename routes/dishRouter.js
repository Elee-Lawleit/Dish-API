const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");

const dishModel = require("../models/dishesModel");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    dishModel
      .find({})
      .populate("comments.author")
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes);
      })
      .catch((error) => next(error));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    dishModel
      .create(req.body)
      .then((dish) => {
        // console.log("Dish created: ", dish);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((error) => next(error));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      dishModel
        .deleteMany({})
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((error) => next(error));
    }
  );

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    dishModel
      .findById(req.params.dishId)
      .populate("comments.author")
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((error) => next(error));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    dishModel
      .findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((error) => next(error));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      dishModel
        .findByIdAndDelete(req.params.dishId)
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((error) => next(error));
    }
  );

dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    dishModel
      .findById(req.params.dishId)
      .populate("comments.author")
      .then((dish) => {
        if (dish != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish.comments);
        } else {
          let error = new Error(`No dish exists with ID ${req.params.dishId}`);
          res.statusCode = 404;
          return next(error);
        }
      })
      .catch((error) => next(error));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    dishModel
      .findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          //push new comment document/object in the main document body
          //req.user object will be modified by verifyUser()
          req.body.author = req.user._id;
          dish.comments.push(req.body);
          dish
            .save()
            .then((dish) => {
              //we need to populate so, we're gonna look up the dish once more
              //there's a obviously a much better way to this
              dishModel
                .findById(dish._id)
                .populate("comments.author")
                .then((populatedDish) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(populatedDish);
                })
                .catch((error) => next(error));
            })
            .catch((error) => next(error));
        } else {
          let error = new Error(`No dish exists with ID ${req.params.dishId}`);
          res.statusCode = 404;
          return next(error);
        }
      })
      .catch((error) => next(error));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /dishes/${req.params.dishId}/comments`
    );
  })
  .delete(
    authenticate.verifyUser,
    (req, res, next) => {
      dishModel
        .findById(req.params.dishId)
        .then((dish) => {
          if (dish != null) {
            for (let i = dish.comments.length - 1; i >= 0; i++) {
              dish.comments.id(dish.comments[i]._id).delete();
            }
            dish
              .save()
              .then((dish) => {
                //don't really need to populate the document when returning the dish here because there are not comments
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              })
              .catch((error) => next(error));
          } else {
            let error = new Error(
              `No dish exists with ID ${req.params.dishId}`
            );
            res.statusCode = 404;
            return next(error);
          }
        })
        .catch((error) => next(error));
    }
  );

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    dishModel
      .findById(req.params.dishId)
      .populate("comments.author")
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          //sending back the specific comment
          res.json(dish.comments.id(req.params.commentId));
        } else if (dish === null) {
          let error = new Error(`No dish exists with ID ${req.params.dishId}`);
          res.statusCode = 404;
          return next(error);
        } else {
          let error = new Error(
            `No comment exists with ID ${req.params.commentId}`
          );
          res.statusCode = 404;
          return next(error);
        }
      })
      .catch((error) => next(error));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    dishModel
      .findById(req.params.dishId)
      .populate("comments.author")
      .then((dish) => {
        if (
          dish != null &&
          dish.comments.id(req.params.commentId) != null &&
          // dish.comments.id(req.params.commentId).author === req.body.author
          String(dish.comments.id(req.params.commentId).author._id) ===
            String(req.user._id)
        ) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save().then((dish) => {
            dishModel
              .findById(dish._id)
              .populate("comments.author")
              .then((populatedDish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(populatedDish);
              });
          });
        } else if (dish === null) {
          let error = new Error(`No dish exists with ID ${req.params.dishId}`);
          res.statusCode = 404;
          return next(error);
        } else if (dish.comments.id(req.params.commentId) === null) {
          let error = new Error(
            `No comment exists with ID ${req.params.commentId}`
          );
          res.statusCode = 404;
          return next(error);
        } else {
          let error = new Error(
            "Comments can only be edited by the person who post them."
          );
          res.statusCode = 403;
          return next(error);
        }
      })
      .catch((error) => next(error));
  })
  .delete(
    authenticate.verifyUser,
    (req, res, next) => {
      dishModel
        .findById(req.params.dishId)
        .then((dish) => {
          if (
            dish != null &&
            dish.comments.id(req.params.commentId) != null &&
            String(dish.comments.id(req.params.commentId).author) ===
              String(req.user._id)
          ) {
            dish.comments.id(req.params.commentId).remove();
            dish
              .save()
              .then((dish) => {
                dishModel
                  .findById(dish._id)
                  .populate("comments.author")
                  .then((populatedDish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(populatedDish);
                  });
              })
              .catch((error) => next(error));
          } else if (dish === null) {
            let error = new Error(
              `No dish exists with ID ${req.params.dishId}`
            );
            res.statusCode = 404;
            return next(error);
          } else if (dish.comments.id(req.params.commentId) === null) {
            let error = new Error(
              `No comment exists with ID ${req.params.commentId}`
            );
            res.statusCode = 404;
            return next(error);
          } else {
            let error = new Error(
              "Comments can only be deleted by the person who post them."
            );
            res.statusCode = 403;
            return next(error);
          }
        })
        .catch((error) => next(error));
    }
  );

module.exports = dishRouter;
