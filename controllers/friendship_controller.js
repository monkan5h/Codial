const Friendship = require("../models/Friendship");
const User = require("../models/User");

module.exports.toggleFriend = async (req, res) => {
  try {
    //Checking if user has sent or received friend req in past
    let isSenderFriendship = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.query.id,
    });
    let isReceiverFriendship = await Friendship.findOne({
      from_user: req.query.id,
      to_user: req.user.id,
    });
    let friendship = isSenderFriendship || isReceiverFriendship;
    //If already in a friendship
    if (friendship) {
      let friend = await User.findById(req.query.id);
      friend.friendship.pull(friendship.id);
      friend.save();
      req.user.friendship.pull(friendship.id);
      req.user.save();
      await Friendship.findByIdAndDelete(friendship.id);
    }
    //If not in a friendship
    else {
      let newFriendship = await Friendship.create({
        from_user: req.user.id,
        to_user: req.query.id,
      });
      req.user.friendship.push(newFriendship.id);
      req.user.save();
      let receiverFriend = await User.findById(req.query.id);
      receiverFriend.friendship.push(newFriendship.id);
      receiverFriend.save();
      added = true;
    }
    return res.redirect("back");
  } catch (error) {
    return res.redirect("back");
  }
};
module.exports.deleteFriend = async (req, res) => {
  try {
    let isSenderFriendship = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.query.id,
    });
    let isReceiverFriendship = await Friendship.findOne({
      from_user: req.query.id,
      to_user: req.user.id,
    });
    let friendship = isSenderFriendship || isReceiverFriendship;
    if (friendship) {
      let friend = await User.findById(req.query.id);
      friend.friendship.pull(friendship.id);
      friend.save();
      req.user.friendship.pull(friendship.id);
      req.user.save();
      await Friendship.findByIdAndDelete(friendship.id);
    } else {
      console.log("Not in friendship ...");
    }
    return res.redirect("back");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
