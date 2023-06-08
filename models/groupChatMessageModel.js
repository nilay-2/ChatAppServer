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
  messageReplyDetails: {
    messageId: {
      type: mongoose.Schema.ObjectId,
    },
    content: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  file: {
    url: {
      type: String,
    },
    fileName: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    size: {
      type: String,
    },
  },
});

const GroupChatMessageModel = mongoose.model("GroupChatMessage", groupChatMessageSchema);

module.exports = GroupChatMessageModel;
