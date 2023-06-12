const InvtNotification = require("../../models/InviteNotificationModel");
const serverStore = require("../../serverStore");
const sendNotification = async (userId) => {
  const io = serverStore.getSocketIoInstance();
  const receiverList = serverStore.getActiveConnections(userId);
  if (receiverList.length > 0) {
    const notifications = await InvtNotification.find({ receiverId: userId })
      .populate({ path: "senderId", select: "_id name email" })
      .populate({ path: "receiverId", select: "_id name email" })
      .sort({ date: -1 });

    io.to(receiverList).emit("send_notification", notifications);
  }
};

module.exports = sendNotification;
