const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:5000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptionsDelegate;
    console.log(req.header('Origin'));
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true};
    }
    else{
        corsOptions ={ origin: false}
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);