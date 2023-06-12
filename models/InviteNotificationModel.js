const mongoose = require("mongoose");

const InvtNotificationSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
  InvtStatus: {
    type: String,
  },
  read: {
    type: Boolean,
  },
});

const InvtNotification = mongoose.model("InvtNotification", InvtNotificationSchema);

module.exports = InvtNotification;
