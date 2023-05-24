const GroupChatRoom = require("../../models/groupChatModel");
const serverStore = require("../../serverStore");
exports.groupChatUpdate = async (userId) => {
  const receiverList = serverStore.getActiveConnections(userId);
  // retrieving all the groups to which the current user is a participant
  const groups = await GroupChatRoom.find({ participants: { $in: [userId] } })
    .populate({
      path: "participants",
      select: "_id name email",
    })
    .populate({ path: "creator", select: "_id  name email" });

  const io = serverStore.getSocketIoInstance();

  //   console.log(userId, groups);
  //   io.emit("groupList", groups);
  receiverList.forEach((receiverSocketId) => {
    io.to(receiverSocketId).emit("groupList", { groups });
  });
};
