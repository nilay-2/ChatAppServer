const jwt = require("jsonwebtoken");
const { promisify } = require("util");
exports.verifySocketToken = async (socket, next) => {
  // console.log("hello");
  const token = socket.handshake.auth?.token;
  // console.log(token);
  try {
    const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
    socket.user = decoded;
  } catch (error) {
    console.log(error);
    return next("Not authorized");
  }
  next();
};
