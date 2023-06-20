const connectedUser = new Map();

let io = null;
let currUser = null;
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
96;

exports.removeConnectedUser = (socketId) => {
  if (connectedUser.has(socketId)) {
    connectedUser.delete(socketId);
    console.log(connectedUser);
  }
};

exports.getOnlineParticipants = (arrayOfIds) => {
  const onlineParticipants = [];
  const offlineParticipants = [];
  const onlineParticipantsIds = [];
  connectedUser.forEach((val, key) => {
    if (arrayOfIds.includes(val.userId)) {
      onlineParticipants.push(key);
      onlineParticipantsIds.push(val.userId);
    }
  });
  arrayOfIds.forEach((val) => {
    if (!onlineParticipantsIds.includes(val.toString())) offlineParticipants.push(`${val}`);
  });
  return { onlineParticipants, offlineParticipants };
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
