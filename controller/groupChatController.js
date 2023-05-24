const GroupChatRoom = require("../models/groupChatModel");
const catchAsync = require("../utils/catchAsync");
const groupUpdateHandler = require("../socketHandler/groupChats/groupChatUpdate");
const GroupChatMessage = require("../models/groupChatMessageModel");
exports.createGroup = catchAsync(async (req, res, next) => {
  const { groupName, arrayOfFriendsId } = req.body;
  arrayOfFriendsId?.push(req.user._id.toString());
  //   console.log(arrayOfFriendsId);

  const group = await GroupChatRoom.create({ groupName, participants: arrayOfFriendsId, creator: req.user._id });

  arrayOfFriendsId.forEach((id) => {
    groupUpdateHandler.groupChatUpdate(id);
    //   groupUpdateHandler.groupChatUpdate(req.user._id.toString());
  });

  res.status(200).json({
    status: "success",
    message: "Group created successfully",
    group,
  });
});

exports.createGroupChatMessage = catchAsync(async (socket, data, io) => {
  const currentUser = await socket.user;
  const { content, date, _id } = data;
  // console.log("message", content, "date", date, "group id", _id);
  const groupChatMessage = await GroupChatMessage.create({
    content,
    date,
    groupId: _id,
    author: currentUser.id,
  });

  this.realTimeGroupChatUpdate(socket, _id, io);
});

exports.realTimeGroupChatUpdate = catchAsync(async (socket, id, io) => {
  const groupChatMessages = await GroupChatMessage.find({ groupId: id }).populate({
    path: "author",
    select: "_id name email",
  });

  io.to(id).emit("recieve_group_message", groupChatMessages);
  // console.log(groupChatMessages);
});

exports.getRealTimeGroupChatMessages = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // console.log("group id:", id);
  const groupChatMessages = await GroupChatMessage.find({ groupId: id }).populate({
    path: "author",
    select: "_id name email",
  });

  res.status(200).json({
    status: "success",
    data: { groupChatMessages },
  });
});
