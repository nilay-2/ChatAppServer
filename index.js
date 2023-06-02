const express = require("express");
const mongoose = require("mongoose");
const globalErrHandler = require("./utils/globalErrHandler");
const userRoutes = require("./routes/userRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const friendsRouter = require("./routes/friendsRoute");
const groupChatRouter = require("./routes/groupChatRoutes");
const cookieParser = require("cookie-parser");
// const { createProxyMiddleware } = require("http-proxy-middleware");
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
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Proxy middleware configuration
// const proxyOptions = {
//   target: "https://firebasestorage.googleapis.com",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/proxy": "", // Remove the '/proxy' prefix from the request URL
//   },
// };

// Create the proxy middleware
// const proxy = createProxyMiddleware(proxyOptions);

// Use the proxy middleware for all requests
// app.use("/proxy", proxy);

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
//   // res.setHeader("Access-Control-Allow-Origin", "https://chatvibe.vercel.app");
//   next();
// });

app.use("/api/users", userRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/friends", friendsRouter);
app.use("/api/groupChat", groupChatRouter);
app.use(globalErrHandler);
const port = process.env.PORT || 5000;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}`);
});
socket.registerSocketServer(server);
