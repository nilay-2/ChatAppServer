const mongoose = require("mongoose");
const MessageNotificationModel = require("../../models/messageNotification");
const serverStore = require("../../serverStore");
exports.createMessageNotification = async (newChat) => {
  const chatNotification = await MessageNotificationModel.create({ messageId: newChat._id });

  await chatNotification.populate({ path: "messageId" }).execPopulate();
  return chatNotification;
};

exports.realTimeChatNotificationUpdate = (chatNotification) => {
  // console.log("chat notification", chatNotification);
  const io = serverStore.getSocketIoInstance();
  const receiverList = serverStore.getActiveConnections(chatNotification.messageId.receiver.toString());
  io.to(receiverList).emit("receive_chat_notification", chatNotification);
};

exports.initialChatNotificationUpdate = async (userId) => {
  const chatNotifications = await MessageNotificationModel.aggregate([
    {
      $lookup: {
        from: "chats", // Replace 'chats' with the actual <collection> name for the Chat model in the database --- note: do not enter the model name while making the model in express
        localField: "messageId",
        foreignField: "_id",
        as: "chats",
      },
    },
    { $unwind: { path: "$chats" } },
    { $match: { "chats.receiver": mongoose.Types.ObjectId(userId) } },
  ]);
  // console.log(`user: ${userId}`);
  // console.log(chatNotifications);
  const io = serverStore.getSocketIoInstance();

  const receiverList = serverStore.getActiveConnections(userId);
  io.to(receiverList).emit("initial_chat_notification_update", chatNotifications);
};
