const Post = require("../../../models/Post");
const Comment = require("../../../models/Comment");

module.exports.index = async (req, res) => {
  try {
    // Populating posts
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });
    return res.status(200).json({
      message: "List of posts",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error Occured ...",
    });
  }
};

module.exports.destroy = async (req, res) => {
  try {
    console.log(req.user);
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    return res.status(200).json({
      message: "post and associated comments deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error Occured ...",
    });
  }
};
