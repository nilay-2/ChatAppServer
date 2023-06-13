const InvtNotification = require("../models/InviteNotificationModel");
const catchAsync = require("../utils/catchAsync");

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await InvtNotification.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { read: true } },
    {
      new: true,
      runValidators: false,
    }
  );

  res.status(200).json({
    status: "success",
    message: "marked as read",
    notification,
  });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await InvtNotification.updateMany({ receiverId: req.user._id }, { read: true }, { new: true, runValidators: false });
  res.status(200).json({
    status: "success",
    message: "All notifications are marked as read",
  });
});
