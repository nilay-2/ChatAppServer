const mongoose = require("mongoose");

const messageNotificationSchema = mongoose.Schema({
  messageId: {
    type: mongoose.Schema.ObjectId,
    ref: "Chat",
    unique: true,
  },
});

const MessageNotificationModel = mongoose.model("messageNotification", messageNotificationSchema);

module.exports = MessageNotificationModel;
