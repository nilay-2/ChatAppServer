const serverStore = require("../serverStore");
const updateFriendsPendingInvitation = require("../socketHandler/friends/updateFriendsPendingInvitations");
const updateFriendsList = require("../socketHandler/friends/updateFriendsList");
const newConnectionHandler = async (socket) => {
  const userId = await socket.user;
  serverStore.addNewConnectedUser({ socketId: socket.id, userId: userId.id });
  const io = serverStore.getSocketIoInstance();
  io.emit("onlineUsers", { onlineUsers: [...serverStore.getOnlineUsers()] });

  // initial update of pending invitations
  updateFriendsPendingInvitation(userId.id.toString());

  // initial update of friends list
  updateFriendsList(userId.id.toString());
};

module.exports = newConnectionHandler;
