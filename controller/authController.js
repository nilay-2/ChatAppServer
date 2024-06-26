const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const url = require("../utils/url");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../.env` });

// profile pic upload controller
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.fileParser = upload.single("photo");

exports.resizeImg = catchAsync(async (req, res, next) => {
  const fileName = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer()
    .then((data) => {
      const base64data = data.toString("base64");
      res.status(200).json({
        status: "success",
        message: "image received",
        bufferData: { fileName, b64data: base64data, contentType: "image/jpeg" },
      });
    });
});

exports.updateProfilePic = catchAsync(async (req, res, next) => {
  // console.log(req.user._id);
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { photo: req.body.photo } },
    { new: true, runValidators: false }
  );
  console.log(user);
  res.status(200).json({
    status: "success",
    message: "photo updated successfully",
    user,
  });
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
  path: "/",
  domain: process.env.NODE_ENV === "development" ? url.backend_Dev_Domain : url.backend_Prod_Domain,
};

const signToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const createToken = (res, user, statusCode, message) => {
  const token = signToken(user);
  let cookieConfig;
  cookieConfig = { ...cookieOptions, expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000) };

  if (process.env.NODE_ENV === "production") {
    cookieConfig.sameSite = "none";
  }
  res.status(statusCode).cookie("jwt", token, cookieConfig).json({
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
  let cookieConfig;
  cookieConfig = { ...cookieOptions };
  if (process.env.NODE_ENV === "production") {
    cookieConfig.sameSite = "none";
  }
  res.clearCookie("jwt", cookieConfig);
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
  const userObj = { ...user?._doc, token };

  // console.log("userObj", userObj);
  req.user = userObj;
  next();
});

exports.allowUsersOnDashboard = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "JWT is valid",
    user: req.user,
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

exports.updateNameAndEmail = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { name: req.body.name, email: req.body.email } },
    { new: true, runValidators: false }
  );

  res.status(200).json({
    status: "success",
    message: "Data received",
  });
});
