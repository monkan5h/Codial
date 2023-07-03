const passport = require("passport");
const GooglePassportStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/User");
const crypto = require("crypto");
const env = require("../config/environment");
const dns = require("dns");

dns.lookupService(
  env.ip == "localhost" ? "127.0.0.1" : env.ip, //lookup for localhost (127.0.0.1) or public ip
  80,
  (err, hostname, service) => {
    // console.log(hostname, service);

    let dnsUrl;
    if (env.ip == "localhost") dnsUrl = env.ip;
    else dnsUrl = hostname.split(" ");

    passport.use(
      new GooglePassportStrategy(
        {
          clientID:
            "937840489012-4saa8dc6n11bv27nun5b2o5jlrbkii6t.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: `http://${dnsUrl}/auth/google/callback`,
        },
        async (acessToken, refreshToken, profile, done) => {
          try {
            //accesstoken- it is same as we were generating and using it in JWT, sending it in header
            //refreshtoken- if accesstoken expires then use it to get new accesstoken
            let isUser = await User.findOne({ email: profile.emails[0].value });
            if (isUser) {
              return done(null, isUser);
            } else {
              let newUser = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: crypto.randomBytes(20).toString("hex"),
              });
              return done(null, newUser);
            }
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
  }
);
