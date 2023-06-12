const InvtNotification = require("../../models/InviteNotificationModel");
const sendInvtNotification = require("../../socketHandler/friends/sendInvtNotification");
const createInvtNotification = async (data) => {
  let sender;
  let receiver;
  if (data.type === "sent") {
    sender = data.sender._id;
    receiver = data.receiver._id;
  } else if (data.type === "accept") {
    sender = data.sender._id;
    receiver = data.receiver;
  } else if (data.type === "reject") {
    sender = data.sender._id;
    receiver = data.receiver;
  }
  const notification = await InvtNotification.create({
    senderId: sender,
    receiverId: receiver,
    date: Date.now(),
    InvtStatus: data.type,
    read: false,
  });

  await sendInvtNotification(data.receiver._id.toString());
};

module.exports = createInvtNotification;
