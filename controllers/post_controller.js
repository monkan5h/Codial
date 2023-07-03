const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const postMailer = require("../mailers/posts_mailer");

module.exports.create = async (req, res) => {
  try {
    let newPost = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    //Populating user to new created post
    let post = await newPost.populate("user");
    console.log(post);
    //Sending email notification
    postMailer.newPosts(post);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post,
        },
        message: "Post Created",
      });
    }
    req.flash("success", "Published new post !!!");
    return res.redirect("back");
  } catch (error) {
    if (error) {
      console.log(error);
      return res.redirect("back");
    }
  }
};
module.exports.delete = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      //Mind serial of deleting objects like post, comment, like
      await Like.deleteMany({ likeable: post.id, onmodel: "post" });
      for (id of post.comments) {
        //finding comments on each post
        let comment = await Comment.findById(id);
        let like = await Like.deleteMany({ _id: { $in: comment.likes } });
      }
      await Comment.deleteMany({ post: req.params.id });
      await Post.findByIdAndDelete(req.params.id);
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post and its associated comments and likes deleted !!!",
        });
      }
      return res.redirect("back");
    }
  } catch (error) {
    if (error) {
      console.log(error);
      return res.redirect("back");
    }
  }
};
