const mongoose = require("mongoose");

const friendsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  friendId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  textedAt: {
    type: Date,
    default: 0,
  },
});

const Friends = mongoose.model("Friends", friendsSchema);

module.exports = Friends;
