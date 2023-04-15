const mongoose = require("mongoose");

const friendInvitationSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

const FriendInvtation = mongoose.model("FriendInvitation", friendInvitationSchema);

module.exports = FriendInvtation;
