const Friends = require("../../models/friendsModel");
const serverStore = require("../../serverStore");
const updateFriendsList = async (userId) => {
  // get active socket IDs of the current user
  const receiverList = serverStore.getActiveConnections(userId);

  if (receiverList.length > 0) {
    // get friends of the current user
    const friends = await Friends.find({ userId: userId }).populate("friendId", "_id name email photo");
    // console.log(friends);

    // get io instance
    const io = serverStore.getSocketIoInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-list", { friends });
    });
  } else return;
};

module.exports = updateFriendsList;
