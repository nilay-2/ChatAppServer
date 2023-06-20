const serverStore = require("../../serverStore");
const GroupChatNotification = require("../../models/groupChatNotificationModel");
exports.realTimeGroupChatNotificationUpdate = async ({ onlineParticipants, groupChatNotification }) => {
  const io = serverStore.getSocketIoInstance();
  // console.log(onlineParticipants, groupChatNotification);
  io.to(onlineParticipants).emit("receive_groupChat_notification", groupChatNotification);
};

exports.initialGroupNotificationUpdate = async (userId) => {
  const notifications = await GroupChatNotification.find({ receiverId: userId }).populate({
    path: "groupMessageId",
    select: "date groupId author _id",
  });
  const io = serverStore.getSocketIoInstance();
  const receiverList = serverStore.getActiveConnections(userId);
  io.to(receiverList).emit("initial_group_notification_update", notifications);
};
