const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // This field is used to store object ID of likeables such as post and comment
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //now a likeable can be post or comment due to this.
    refPath: "onmodel",
  },
  onmodel: {
    type: String,
    required: true,
    //here enum define likeable can be only Post or Comment, if we dont use enum, likeable will be any type.
    enum: ["post", "comment"],
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
