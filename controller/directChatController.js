const catchAsync = require("../utils/catchAsync");
const Chat = require("../models/chatModel");
const directChatUpdate = require("../socketHandler/directChats/directChatUpdate");
exports.createNewDirectChats = async (socket, data) => {
  console.log(data);
  const author = await socket.user;
  const { receiverId, content, date } = data;

  const newChat = await Chat.create({
    participants: [author.id, receiverId],
    content,
    author: author.id,
    receiver: receiverId,
    date,
  });

  directChatUpdate.realTimeChatUpdate(author.id, receiverId);

  console.log(newChat);
};

exports.getChatHistory = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { author, receiver } = req.body;

  const conversation = await Chat.find(
    { participants: { $all: [author, receiver] } },
    { _id: 1, content: 1, author: 1, receiver: 1, date: 1 }
  ).populate([
    { path: "author", select: "_id name email" },
    // { path: "receiver", select: "_id name email" },
  ]);

  res.status(200).json({
    status: "success",
    messages: conversation,
  });
});
