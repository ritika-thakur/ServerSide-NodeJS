var passport = require("passport");
var LoaclStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); 
var config = require("./config.js");

passport.use(new LoaclStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,
        {expiresIn: 7200});
}

var opts= {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({
            _id: jwt_payload._id
        }, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {
    session: false
});

exports.verifyOrdinaryUser = passport.authenticate("jwt", function(req, res, next){
    User.findOne({username: username}, function(err, user){
        if(user){
            req.user.token = user.token;
        }else{
            err = new Error("User not found!");
            err.status = 404;
            return next(err);
        }
    });
});

exports.verifyAdmin = passport.authenticate("jwt", function(req, res, next){
    User.findOne({username: username}, function(err, user){
        if(req.user.admin === false){
            err= new Error("You are not authenticated to perform this operation!");
            err.status=403;
            return next(err);
        }
        else if(req.user.admin === true){
            return next();
        }
        else{
             err = new Error("You are not authenticated !");
             err.status = 404;
             return next(err);
        }

    });
});