const socket = require("socket.io");
const authSocket = require("./controller/authSocket");
const newConnectionHandler = require("./socketHandler/newConnectionHandler");
const disconnectHandler = require("./socketHandler/disconnectHandler");
const directChatController = require("./controller/directChatController");
const groupChatController = require("./controller/groupChatController");
const serverStore = require("./serverStore");

let GLOBAL_CURRENT_ROOM_ID = null;

exports.registerSocketServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://chatsphereclient.netlify.app/",
      credentials: true,
      methods: ["GET", "POST", "PATCH"],
    },
  });

  serverStore.setSocketIoInstance(io);

  io.use((socket, next) => {
    authSocket.verifySocketToken(socket, next);
    // next();
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("onlineUsers", { onlineUsers });
  };

  io.on("connection", (socket) => {
    // console.log("user connected", socket.id);
    newConnectionHandler(socket);

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });

    socket.on("directMessage", (data) => {
      console.log(data);
      directChatController.createNewDirectChats(socket, data);
    });

    socket.on("join_group", (data) => {
      if (GLOBAL_CURRENT_ROOM_ID === null) {
        GLOBAL_CURRENT_ROOM_ID = data._id;
        socket.join(data._id);
      } else if (GLOBAL_CURRENT_ROOM_ID !== null) {
        socket.leave(GLOBAL_CURRENT_ROOM_ID);
        socket.join(data._id);
        GLOBAL_CURRENT_ROOM_ID = data._id;
      }
      console.log("All connected Rooms", socket.rooms);
      console.log("User connect to room: ", data._id);
      console.log("current room", GLOBAL_CURRENT_ROOM_ID);
      // the below code registers the "send_group_message" multiple time each time the join group message is tirggered
      // socket.on("send_group_message", (data) => {
      //   groupChatController.createGroupChatMessage(socket, data, io);
      //   // console.log("groupMessages", groupMessages);
      // });
    });
    socket.on("send_group_message", (data) => {
      groupChatController.createGroupChatMessage(socket, data, io);
    });

    socket.on("send_typing_indicator_event", (data) => {
      // console.log(data);
      const activeConnectionsOfReceiver = serverStore.getActiveConnections(data.id);
      const [receiverSocketId] = activeConnectionsOfReceiver;
      // receiver_details_for_typing_indicator = receiverSocketId;
      // sender_details_for_typing_indicator = data.sender;
      socket.to(receiverSocketId).emit("received_typing_indicator_event", data.sender);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 1000);
};
