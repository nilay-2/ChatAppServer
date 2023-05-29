const { Socket } = require("socket.io");
const Chat = require("../../models/chatModel");
const serverStore = require("../../serverStore");
// exports.realTimeChatUpdate = async (author, receiver) => {
//   const conversation = await Chat.find(
//     { participants: { $all: [author, receiver] } },
//     { _id: 1, content: 1, author: 1, receiver: 1, date: 1 }
//   ).populate([
//     { path: "author", select: "_id name email" },
//     // { path: "receiver", select: "_id name email" },
//   ]);
//   // console.log(conversation);
//   const io = serverStore.getSocketIoInstance();

//   const receiverList = serverStore.getActiveConnections(receiver);
//   // console.log("receiverlist", receiverList);
//   if (conversation.length > 0) {
//     receiverList.forEach((receiverId) => {
//       io.to(receiverId).emit("realTimeChatUpdate", conversation); // io.emit() sends message to both the sender and the receiver whereas socket.emit() sends only to the receiver and not the sender
//     });
//     // io.emit("realTimeChatUpdate", conversation);
//   }
// };

exports.realTimeChatUpdate = (newChat, author, receiver) => {
  // console.log(newChat);
  const io = serverStore.getSocketIoInstance();
  const authorList = serverStore.getActiveConnections(author);
  const receiverList = serverStore.getActiveConnections(receiver);
  // console.log(authorList);
  // receiverList.forEach((receiverId) => {}); // we can use loops
  io.to([...receiverList, ...authorList]).emit("realTimeChatUpdate", newChat); // we can directly pass the array // send the new message to author and sender both
};
