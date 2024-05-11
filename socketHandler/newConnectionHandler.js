const serverStore = require("../serverStore");
const updateFriendsPendingInvitation = require("../socketHandler/friends/updateFriendsPendingInvitations");
const groupUpdateHandler = require("../socketHandler/groupChats/groupChatUpdate");
const sendInvtNotification = require("../socketHandler/friends/sendInvtNotification");
const directChatNotification = require("../socketHandler/directChats/directChatNotification");
const groupChatNotificationUpdate = require("../socketHandler/groupChats/groupChatNotificationUpdate");
const newConnectionHandler = async (socket) => {
  const userId = await socket.user;
  serverStore.addNewConnectedUser({ socketId: socket.id, userId: userId.id });
  const io = serverStore.getSocketIoInstance();
  io.emit("onlineUsers", { onlineUsers: [...serverStore.getOnlineUsers()] });

  // initial update of pending invitations
  updateFriendsPendingInvitation(userId.id.toString());

  // initial update of groups
  groupUpdateHandler.groupChatUpdate(userId.id.toString());

  // initial update of notifications
  sendInvtNotification(userId.id.toString());

  // initial direct chat notification update
  directChatNotification.initialChatNotificationUpdate(userId.id.toString());

  // initial group chat notification update
  groupChatNotificationUpdate.initialGroupNotificationUpdate(userId.id);
};

module.exports = newConnectionHandler;
