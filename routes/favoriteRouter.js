const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const config = require('../config');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
        .populate("user").populate("dishes")
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
        err.statusCode = 403;
        err = new Error('PUT operation not allowed here');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
            user: req.user._id
        })
            .then((favorite) => {
                if(favorite === null){
                    Favorites.create()
                    .then ((newfavorite) => {
                        newfavorite.user=req.user.id;
                        newfavorite.dishes.push(req.body);
                        console.log('Dish/Dishes Added to the Favorite List ', newfavorite);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(newfavorite);
                    })
                }else{
                    favorite.dishes.push(req.body);
                    console.log('Dish/Dishes Added to the Favorite List ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({
            user: req.user._id
        })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



favoriteRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
   })
   .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        err.statusCode = 403;
        err = new Error('GET operation not allowed here');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        err.statusCode = 403;
        err = new Error('PUT operation not allowed here');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
            user: req.user._id
        })
        .then((favdish) => {
            if(favdish === null){
                Favorites.create()
                 .then( (newfavorite) => {
                          user=req.user.id;
                          newfavorite.dishes.push(req.params.dishId);
                 })
            }else{
                favdish.dishes.findById(req.params.dishId)
                 .then((dish)=>{
                     if(dish === null){
                         favdish.dishes.push(req.params.dishId)
                     }else{
                         err = new Error('Dish Already exists in the list.');
                         err.statusCode = 403;
                         return next(err);
                     }
                 }, (err) => next(err))
            }
        }, (err)=> next(err))
        .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
            user: req.user._id
        })
            .then((list) => {
                
                    if (list != null && list.dishes.id(req.params.dishId) != null) {

                        list.dishes.id(req.params.dishId).remove();
                        list.save();

                    } else if (list.dishes.id(req.params.dishId) == null) {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    } else {
                        err = new Error('Favorite List does not exist.');
                        err.status = 404;
                        return next(err);

                } 

            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;