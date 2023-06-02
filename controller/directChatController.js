const catchAsync = require("../utils/catchAsync");
const Chat = require("../models/chatModel");
const directChatUpdate = require("../socketHandler/directChats/directChatUpdate");
exports.createNewDirectChats = catchAsync(async (socket, data) => {
  // console.log(data);
  const author = await socket.user;
  const { receiverId, content, date, file } = data;

  const messageReplyDetails = data?.messageReplyDetails;

  // console.log(messageReplyDetails);

  const newChat = await Chat.create({
    participants: [author.id, receiverId],
    content,
    author: author.id,
    receiver: receiverId,
    date,
    messageReplyDetails,
    file,
  });

  newChat.participants = undefined;
  await newChat.populate({ path: "author", select: "_id name email" }).execPopulate();

  // directChatUpdate.realTimeChatUpdate(author.id, receiverId);
  directChatUpdate.realTimeChatUpdate(newChat, author.id, receiverId);
});

exports.getChatHistory = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const { author, receiver } = req.body;

  const conversation = await Chat.find({ participants: { $all: [author, receiver] } })
    .select("-participants -__v")
    .populate([
      { path: "author", select: "_id name email" },
      // { path: "receiver", select: "_id name email" },
    ]);

  res.status(200).json({
    status: "success",
    messages: conversation,
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;

  if (!messageId) return next("Please try again later");

  await Chat.findByIdAndDelete(messageId);

  res.status(200).json({
    status: "success",
    message: "Message deleted successfully",
  });
});
