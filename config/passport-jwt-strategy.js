const passport = require("passport");
const User = require("../models/User");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const env = require("../config/environment");

//We encrypt using a key
let opts = {
  //here header has list of keys, among those authorization is also a key, this authorization also has a lot of keys, with key bearer.
  //this bearer will keep token
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken,
  secretOrKey: env.jwtSecret,
};

passport.use(
  new jwtStrategy(opts, function (jwtPayload, done) {
    //Here we will use jwtPayload id to auth user
    User.findById(jwtPayload.id, (error, user) => {
      if (error) return console.log("Error finding user from JWT");
      if (user) return done(null, user);
      else return done(null, false);
    });
  })
);

module.exports = passport;
