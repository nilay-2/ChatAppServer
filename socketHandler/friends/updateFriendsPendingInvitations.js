const catchAsync = require("../../utils/catchAsync");
const FriendInvitation = require("../../models/friendInvitationModel");
const serverStore = require("../../serverStore");
const updateFriendsPendingInvitation = async (userId) => {
  const receiverList = serverStore.getActiveConnections(userId);
  if (receiverList.length > 0) {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
      accepted: false,
    }).populate("senderId", "_id name email");
    // console.log(pendingInvitations);

    // get socket instance
    const io = serverStore.getSocketIoInstance();
    //   console.log(receiverList);

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } else return;
};

module.exports = updateFriendsPendingInvitation;
