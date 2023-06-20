const mongoose = require("mongoose");

const groupChatNotificationSchema = mongoose.Schema({
  groupMessageId: {
    type: mongoose.Schema.ObjectId,
    ref: "GroupChatMessage",
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

groupChatNotificationSchema.index({ groupMessageId: 1, receiverId: 1 }, { unique: true });

const GroupChatNotification = mongoose.model("GroupChatNotification", groupChatNotificationSchema);

module.exports = GroupChatNotification;
