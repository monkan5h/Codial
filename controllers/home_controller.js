const Post = require("../models/Post");
const User = require("../models/User");
const env = require("./../config/environment");

module.exports.home = async (req, res) => {
  try {
    // Populating posts with createdAt time, its user, its comments and comment user and likes, and post likes
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user likes" },
        options: { sort: "-createdAt" },
      })
      .populate({
        path: "likes",
      });
    let users = await User.find({});

    //Initializing friends array
    let friends = new Array();
    if (req.user) {
      await req.user.populate({
        path: "friendship",
        populate: { path: "from_user to_user" },
      });

      //If friend of user, then push it to friend array
      for (f of req.user.friendship) {
        if (req.user.id == f.from_user.id)
          friends.push({ userFriendshipId: f.id, userFriend: f.to_user });
        else if (req.user.id == f.to_user.id) {
          friends.push({ userFriendshipId: f.id, userFriend: f.from_user });
        }
      }
    }

    return res.render("home", {
      posts,
      users,
      friends,
      env,
    });
  } catch (error) {
    if (error) {
      req.flash("error", "Error occured !!!");
      console.log(error);
    }
  }
};
