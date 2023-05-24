const mongoose = require("mongoose");

const groupChatSchema = mongoose.Schema({
  groupName: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

const GroupChatRoom = mongoose.model("GroupChatRoom", groupChatSchema);

module.exports = GroupChatRoom;
