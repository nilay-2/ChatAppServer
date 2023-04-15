const socket = require("socket.io");
const authSocket = require("./controller/authSocket");
const newConnectionHandler = require("./socketHandler/newConnectionHandler");
const disconnectHandler = require("./socketHandler/disconnectHandler");
const directChatController = require("./controller/directChatController");
const serverStore = require("./serverStore");
exports.registerSocketServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
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
    console.log("user connected", socket.id);
    newConnectionHandler(socket);

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });

    socket.on("directMessage", (data) => {
      directChatController.createNewDirectChats(socket, data);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 1000);
};
