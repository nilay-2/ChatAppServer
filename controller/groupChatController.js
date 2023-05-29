const GroupChatRoom = require("../models/groupChatModel");
const catchAsync = require("../utils/catchAsync");
const groupUpdateHandler = require("../socketHandler/groupChats/groupChatUpdate");
const GroupChatMessage = require("../models/groupChatMessageModel");
exports.createGroup = catchAsync(async (req, res, next) => {
  const { groupName, arrayOfFriendsId } = req.body;
  arrayOfFriendsId?.push(req.user._id.toString());

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

  const messageReplyDetails = data?.messageReplyDetails;

  const groupChatMessage = await GroupChatMessage.create({
    content,
    date,
    groupId: _id,
    author: currentUser.id,
    messageReplyDetails,
  });
  console.log(messageReplyDetails);

  await groupChatMessage.populate({ path: "author", select: "_id name email" }).execPopulate();

  this.realTimeGroupChatUpdate(socket, _id, io, groupChatMessage);
});

exports.realTimeGroupChatUpdate = async (socket, id, io, groupChatMessage) => {
  io.to(id).emit("recieve_group_message", groupChatMessage);
  // console.log(groupChatMessages);
};

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

exports.deleteGroupChatMessage = catchAsync(async (req, res, next) => {
  const { groupId, messageId } = req.params;

  await GroupChatMessage.findOneAndDelete({ _id: messageId, groupId: groupId });

  res.status(200).json({
    status: "success",
    message: "Message deleted successfully",
  });
});
