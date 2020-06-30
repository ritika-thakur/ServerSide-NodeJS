const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Promotions = require('../models/promotions');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

         promoRouter.route('/')
         .options(cors.corsWithOptions, (req, res) => {
             res.sendStatus(200);
         })
             .get(cors.cors, (req, res, next) => {
                 Promotions.find({})
                     .then((promotions) => {
                         console.log('Will send all the dishes to you');
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(promotions);
                     }, (err) => next(err))
                     .catch((err) => next(err));
             })
             .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
                 Promotions.create(req.body)
                     .then((promotion) => {
                         console.log('Will add the dish: ' + req.params.name + ', with details: ' + req.params.description);
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(promotion);
                     }, (err) => next(err))
                     .catch((err) => next(err));
             })
             .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
                 res.statusCode = 200;
                 res.end('PUT operation not supported on /promotions');
             })
             .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
                 Promotions.remove({})
                     .then((resp) => {
                         console.log('Deleting all the dishes');
                         
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(resp);
                     }, (err) => next(err))
                     .catch((err) => next(err));
             });

         promoRouter.route('/:promoId')
             .options(cors.corsWithOptions, (req, res) => {
                 res.sendStatus(200);
             })
             .get(cors.cors, (req, res, next) => {
                 Promotions.findById(req.params.promotionId)
                     .then((promotion) => {
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(promotion);
                     }, (err) => next(err))
                     .catch((err) => next(err));
             })
             .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
                 res.statusCode = 403;
                 res.end('POST operation not supported on /promotions/' + req.params.promotionId);
             })
             .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
                  Promotions.findByIdAndUpdate(req.params.promotionId, {
                         $set: req.body
                     }, {
                         new: true
                     })
                     .then((promotion) => {
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(promotion);
                     }, (err) => next(err))
                     .catch((err) => next(err));
             })
             .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
                 Promotions.findByIdAndRemove(req.params.promotionId)
                     .then((resp) => {
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(resp);
                     }, (err) => next(err))
                     .catch((err) => next(err));
             });



module.exports = promoRouter;