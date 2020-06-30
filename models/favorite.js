const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

let updatedDate = new Date();


const favoriteSchema = [{
    updatedAt: updatedDate,
    createdAt: updatedDate,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    }]

}];

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;
