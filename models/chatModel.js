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
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
