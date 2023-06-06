const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// const cookieOptions = {
//   httpOnly: true,
//   expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 60 * 60 * 1000),
//   secure: false,
// };
const url = require("../utils/url");

const signToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const createToken = (res, user, statusCode, message) => {
  const token = signToken(user);
  res
    .status(statusCode)
    .cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
      secure: url.frontEndUrl === "http://localhost:3000" ? false : true,
      path: "/",
      domain: url.frontEndUrl === "http://localhost:3000" ? "localhost" : "chatsphereserver.up.railway.app",
      // sameSite: "none",
    })
    .json({
      status: "success",
      message,
      user,
      token,
    });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const prevUser = await User.exists({ email });
  if (prevUser) {
    return next("Email already exists, please login");
  }
  const user = await User.create(req.body);
  createToken(res, user, 200, "Registration successful");
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  // const user = await findOne({email: email})
  if (!user) {
    return next("Please create an account");
  }
  if (!(await user.checkPassword(user.password, password))) {
    return next("Invalid username or password");
  }

  createToken(res, user, 200, "Login successful");
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);
  if (!token) {
    return next("Please login");
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next("This email no longer exists");
  }
  const response = user.checkIfPasswordChangedAt(decoded.iat);
  if (response) {
    return next("User recently changed password, please login");
  }
  req.user = user;
  next();
});

exports.allowUsersOnDashboard = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "JWT is valid",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const user = await User.findById(req.user.id);
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordChangedAt = Date.now() - 1000;
  user.save({ validateBeforeSave: false });
  createToken(res, user, 200, "Password updated successfully");
});
