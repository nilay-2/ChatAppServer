const Friends = require("../models/friendsModel");
const catchAsync = require("../utils/catchAsync");
exports.getFriends = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  const friends = await Friends.find({ userId: req.user._id }).populate({ path: "friendId", select: "_id name email" });
  res.status(200).json({
    status: "success",
    friends,
  });
});
