const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Like = require("../models/Like");
module.exports.create = async (req, res) => {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment.id);
      post.save();

      //Populating comments with its user
      comment = await comment.populate("user");
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment,
            post,
          },
          message: "Created new comment !!!",
        });
      }
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
  return res.redirect("back");
};

module.exports.destroy = async (req, res) => {
  try {
    let post = await Post.findById(req.params.post);
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id || post.user == req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
      await Post.findByIdAndUpdate(req.params.post, {
        $pull: { comments: req.params.id },
      });
      await Like.deleteMany({ likeable: comment.id, onmodel: "comment" });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment and its associated likes deleted !!!",
        });
      }
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
  return res.redirect("back");
};
