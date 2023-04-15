const connectedUser = new Map();

let io = null;

exports.setSocketIoInstance = (ioInstance) => {
  io = ioInstance;
};

exports.getSocketIoInstance = () => {
  return io;
};

exports.addNewConnectedUser = ({ socketId, userId }) => {
  connectedUser.set(socketId, { userId });
  console.log(connectedUser);
};

exports.removeConnectedUser = (socketId) => {
  if (connectedUser.has(socketId)) {
    connectedUser.delete(socketId);
    console.log(connectedUser);
  }
};

exports.getActiveConnections = (receiverId) => {
  const activeConnection = [];
  connectedUser.forEach((val, key) => {
    if (val?.userId === receiverId) {
      activeConnection.push(key);
      // console.log(`activeConnection: ${activeConnection}`);
    }
  });
  return activeConnection;
};

exports.getOnlineUsers = () => {
  const onlineUsers = [];
  connectedUser.forEach((val, key) => {
    onlineUsers.push({ socketId: key, userId: val.userId });
  });
  return onlineUsers;
};
