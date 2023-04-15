const Chat = require("../../models/chatModel");
const serverStore = require("../../serverStore");

exports.realTimeChatUpdate = async (author, receiver) => {
  const conversation = await Chat.find(
    { participants: { $all: [author, receiver] } },
    { _id: 1, content: 1, author: 1, receiver: 1, date: 1 }
  ).populate([
    { path: "author", select: "_id name email" },
    // { path: "receiver", select: "_id name email" },
  ]);
  console.log(conversation);
  const io = serverStore.getSocketIoInstance();

  if (conversation.length > 0) {
    io.emit("realTimeChatUpdate", conversation);
  }
};
