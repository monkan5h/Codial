const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports.toggleLike = async (req, res) => {
  try {
    let likeable;
    let deleted = false;
    
    //fetching likeable
    if (req.query.type == "post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    //checking if like exist or not
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onmodel: req.query.type,
      user: req.user._id,
    });
    if (existingLike) {
      likeable.likes.pull(existingLike.id);
      likeable.save();
      let a = await Like.findByIdAndDelete(existingLike.id);
      deleted = true;
    } else {
      let newLike = await Like.create({
        user: req.user.id,
        likeable: req.query.id,
        onmodel: req.query.type,
      });
      likeable.likes.push(newLike.id);
      likeable.save();
    }
    return res.status(200).json({
      message: "Request Successful ...",
      deleted,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  }
};
