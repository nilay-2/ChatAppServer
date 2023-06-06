const express = require("express");
const mongoose = require("mongoose");
const globalErrHandler = require("./utils/globalErrHandler");
const userRoutes = require("./routes/userRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const friendsRouter = require("./routes/friendsRoute");
const groupChatRouter = require("./routes/groupChatRoutes");
const cookieParser = require("cookie-parser");
const url = require("./utils/url");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./.env" });

// socket server
const socket = require("./socket");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: url.frontEndUrl,
    credentials: true,
  })
);

const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://master--keen-chaja-a2d6ae.netlify.app");
//   next();
// });

app.use("/api/users", userRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/friends", friendsRouter);
app.use("/api/groupChat", groupChatRouter);
app.use(globalErrHandler);
const port = process.env.PORT || 5000;
const host = url.frontEndUrl === "http://localhost:3000" ? "127.0.0.1" : "0.0.0.0";
const server = app.listen(port, host, () => {
  console.log(`App running on port ${port}`);
});
socket.registerSocketServer(server);
