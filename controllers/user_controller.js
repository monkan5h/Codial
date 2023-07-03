const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const Friendship = require("../models/Friendship");
module.exports.profile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    //Getting Relationship
    let isSender = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.params.id,
    });
    let isReceiver = await Friendship.findOne({
      to_user: req.user.id,
      from_user: req.params.id,
    });

    let friend = isSender || isReceiver;

    return res.render("user_profile", { profile_user: user, friend });
  } catch (error) {
    return res.redirect("back");
  }
};

module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Already Logged In. !!!");
    return res.redirect("/");
  }
  return res.render("user_sign_in");
};

module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Already Logged In. !!!");
    return res.redirect("/");
  }
  return res.render("user_sign_up");
};

module.exports.signOut = (req, res, next) => {
  req.flash("success", "Logged Out Successfully.");
  req.logOut();
  return res.redirect("/user/sign-in");

  // //Below method will delete session cookie also
  // req.session.destroy(function (err) {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.clearCookie("codeial");
  //   console.log("Logged Out Successfully. !!!");
  //   return res.redirect("/user/sign-in");
  // });
};
module.exports.createSession = async (req, res) => {
  req.flash("success", "Logged In Successfully.");
  return res.redirect("/");
};

module.exports.create = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password does not match !!!");
      console.log("Password does not match");
      return res.redirect("back");
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      req.flash("error", "User already exist !!!");
      console.log("User already exist !!!");
      return res.redirect("back");
    }
    let newUser = await User.create(req.body);
    if (newUser) {
      req.flash("success", "Created new user !!!");
      console.log("Created new user !!!", newUser);
      return res.redirect("/user/sign-in");
    }
    req.flash("error", "Could not signup !!!");
    console.log("Could not signup !!!");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
};

module.exports.update = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      let user = await User.findById(req.params.id);
      User.uploadAvatar(req, res, function (error) {
        if (error) {
          req.flash("error", "****** Multer Error *******");
          return console.log("****** Multer Error *******", error);
        }
        user.name = req.body.name;
        // user.email = req.body.email; //We should not update email
        if (req.file) {
          if (
            user.avatar &&
            fs.existsSync(path.join(__dirname, "..", user.avatar))
          ) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        req.flash("success", "Profile updated successfully !!!");
        return res.redirect("back");
      });
    } else {
      req.flash("error", "You are not authorized !!!");
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    req.flash("error", "Could not update profile !!!");
    return res.redirect("back");
  }
};
