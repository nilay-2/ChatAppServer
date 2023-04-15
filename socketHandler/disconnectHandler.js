const serverStore = require("../serverStore");

const disconnectHandler = (socket) => {
  serverStore.removeConnectedUser(socket.id);
  const io = serverStore.getSocketIoInstance();
  io.emit("onlineUsers", { onlineUsers: [...serverStore.getOnlineUsers()] });
};

module.exports = disconnectHandler;
