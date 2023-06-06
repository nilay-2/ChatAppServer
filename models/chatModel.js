const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  content: {
    type: String,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
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
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
