const GroupChatRoom = require("../models/groupChatModel");
const catchAsync = require("../utils/catchAsync");
const groupUpdateHandler = require("../socketHandler/groupChats/groupChatUpdate");
const GroupChatMessage = require("../models/groupChatMessageModel");
const GroupChatNotification = require("../models/groupChatNotificationModel");
const serverStore = require("../serverStore");
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
  const { content, date, _id, file } = data;

  const messageReplyDetails = data?.messageReplyDetails;

  const groupChatMessage = await GroupChatMessage.create({
    content,
    date,
    groupId: _id,
    author: currentUser.id,
    messageReplyDetails,
    file,
  });

  await groupChatMessage
    .populate({ path: "author", select: "_id name email" })
    .populate({ path: "groupId", select: "participants" })
    .execPopulate();

  this.realTimeGroupChatUpdate(_id, io, groupChatMessage);
});

exports.realTimeGroupChatUpdate = async (id, io, groupChatMessage) => {
  // send groupChatMessages to the socket ids of the online participants of the group for notification
  const { onlineParticipants, offlineParticipants } = serverStore.getOnlineParticipants(
    groupChatMessage.groupId?.participants
  );

  // here id is room id from the database and not socketId
  io.to(id).to(onlineParticipants).emit("recieve_group_message", groupChatMessage);
};

exports.getRealTimeGroupChatMessages = catchAsync(async (req, res, next) => {
  const { id } = req.params;
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

exports.createGroupChatNotification = async (data) => {
  try {
    const { onlineParticipants, offlineParticipants } = serverStore.getOnlineParticipants(
      data.groupChatMessages.groupId?.participants
    );
    // console.log(offlineParticipants);
    // send notification to offline participants
    // func()
    offlineParticipants.forEach(async (offlineId) => {
      try {
        await GroupChatNotification.create({
          groupMessageId: data.groupChatMessages._id,
          receiverId: offlineId,
        });
      } catch (error) {
        console.log("Duplicate entires");
      }
    });

    const groupChatNotification = await GroupChatNotification.create({
      groupMessageId: data.groupChatMessages._id,
      receiverId: data.receiverId,
    });
    await groupChatNotification.populate({ path: "groupMessageId" }).execPopulate();
    return { onlineParticipants, groupChatNotification };
  } catch (error) {
    console.log(`Duplicated entries are not allowed`);
  }
};
