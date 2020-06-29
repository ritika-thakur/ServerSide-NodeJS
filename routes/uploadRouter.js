const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const config = require('../config');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const imageFileFilter = (req, file, callback)=> {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error("You can upload only image files!"), false);
    }
    callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .get(authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .put(authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /imageUpload');
    })
    .post(authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);    
    })
    .delete(authenticate.verifyUser, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    });


module.exports = uploadRouter;