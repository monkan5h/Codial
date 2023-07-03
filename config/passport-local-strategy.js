const passport = require("passport");
const LocalPassportStrategy = require("passport-local").Strategy;
const User = require("../models/User");

//We wanna set noty notification just after signIn, not during signIn,
//So we have to set req.flash in passport.use
passport.use(
  new LocalPassportStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },

    //This fn will fetch the user, then user.id will be used in serializer fn to store id in cookie
    async (req, email, password, done) => {
      //done callback is called based on condition with arguments
      try {
        let user = await User.findOne({ email });
        if (!user || user.password != password) {
          console.log("Invalid email/password");
          req.flash("error", "Invalid email/password");
          //null for no error , false for not authenticated
          return done(null, false);
        }
        //null for no error, returning user
        return done(null, user);
      } catch (error) {
        if (error) {
          req.flash("error", "Error while finding user --> passport");
          console.log("Error while finding user --> passport");
          return done(error);
        }
      }
    }
  )
);

//serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.email);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async (email, done) => {
  try {
    let user = await User.findOne({ email });
    return done(null, user);
  } catch (error) {
    if (error) {
      req.flash("error", "Error while finding user --> deserialize");
      console.log("Error while finding user --> deserialize");
      return done(error);
    }
  }
});

//fn to check if user is authenticated, we will use this fn as middleware
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    //isAuthenticated() is provided by passport
    return next();
  }
  //if user is not signed in
  return res.redirect("/user/sign-in");
};

//set the user for sign-in
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contain the current user from session cookie
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
