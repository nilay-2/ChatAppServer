const mongoose = require("mongoose");

const groupChatMessageSchema = mongoose.Schema({
  content: {
    type: String,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
  groupId: {
    type: mongoose.Schema.ObjectId,
    ref: "GroupChatRoom",
  },
});

const GroupChatMessageModel = mongoose.model("GroupChatMessage", groupChatMessageSchema);

module.exports = GroupChatMessageModel;
