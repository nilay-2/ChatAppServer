const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const serverStore = require("../serverStore");
exports.verifySocketToken = async (socket, next) => {
  // console.log("hello");
  const token = socket.handshake.auth?.token;
  // console.log(token);
  // console.log(socket.handshake.auth);
  try {
    const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
    socket.user = decoded;
  } catch (error) {
    // console.log(error);
    return next("Not authorized");
  }
  next();
};
