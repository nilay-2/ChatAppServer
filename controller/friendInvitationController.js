const User = require("../models/userModel");
const FriendInvitation = require("../models/friendInvitationModel");
const Friends = require("../models/friendsModel");
const catchAsync = require("../utils/catchAsync");
const updateFriendsPendingInvitation = require("../socketHandler/friends/updateFriendsPendingInvitations");
const updateFriendsList = require("../socketHandler/friends/updateFriendsList");
const createInvtNotification = require("../socketHandler/friends/createNotification");
exports.sendInvite = catchAsync(async (req, res, next) => {
  const { mail: receiverEmail } = req.body;
  const { email: senderEmail, _id: senderId } = req.user;

  // cannot send invite to self

  if (receiverEmail.toLowerCase() === senderEmail.toLowerCase()) {
    return next("Cannot send friend invitation to yourself");
  }

  // friend to whom invite is sent is not present in the database

  const receiver = await User.findOne({ email: receiverEmail });
  if (!receiver) {
    return next(`Could not find ${receiverEmail}, please check the email address`);
  }

  // if sender and receiver are already friends

  const frnds = await Friends.find({
    $or: [
      { userId: senderId, friendId: receiver._id },
      { userId: receiver._id, friendId: senderId },
    ],
  });

  // console.log("friends", frnds);

  if (frnds.length === 2) {
    return next(`You are already a friend of ${receiver.email}`);
  }
  // if friend request is already sent between sender and reciever

  const friendInvt = await FriendInvitation.findOne({
    senderId: senderId,
    receiverId: receiver._id,
    accepted: false,
  });

  if (friendInvt && !friendInvt.accepted) {
    return next(`Invitation has been sent already to ${receiverEmail}`);
  }

  // create a friend invitation in the database
  const Invite = await FriendInvitation.create({
    receiverId: receiver._id,
    senderId,
  });
  // console.log(Invite);

  updateFriendsPendingInvitation(receiver._id.toString());

  // invite notification -- accept and reject
  await createInvtNotification({ sender: req.user, receiver, type: "sent" });

  res.status(200).json({
    status: "success",
    message: `Invitation has been sent to ${receiverEmail}`,
  });
});

exports.rejectInvitation = catchAsync(async (req, res, next) => {
  const { id: InvtId } = req.body;
  const { _id: receiverId } = req.user;

  // remove invitation
  const Invt = await FriendInvitation.findOneAndDelete({ _id: InvtId, accepted: false });
  // console.log(Invt);

  if (!Invt) {
    return next("Invitation does not exist");
  }

  // update friends list for receiver and sender
  // updateFriendsList(receiverId.toString());
  // updateFriendsList(Invt.senderId.toString());
  // update pending invitations list
  updateFriendsPendingInvitation(receiverId.toString());

  // --notification - accepting request
  await createInvtNotification({ sender: req.user, receiver: Invt.senderId, type: "reject" });

  res.status(200).json({
    status: "success",
    message: "Invitation rejected",
  });
});

exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const { id: InvtId } = req.body;
  const { _id: receiverId } = req.user;

  const Invite = await FriendInvitation.findOneAndUpdate(
    { _id: InvtId },
    { accepted: true },
    { new: true, runValidators: true }
  );

  const { senderId } = Invite;
  // console.log(`Invite Id: ${InvtId} \n receiverId: ${receiverId} \n senderid: ${senderId}`);

  const friends = await Friends.insertMany([
    { userId: senderId, friendId: receiverId },
    { userId: receiverId, friendId: senderId },
  ]);

  // update friends list for receiver and sender
  updateFriendsList(receiverId.toString());
  updateFriendsList(senderId.toString());
  // update pending invitation list
  updateFriendsPendingInvitation(receiverId.toString());
  // --notification - rejecting request
  await createInvtNotification({ sender: req.user, receiver: senderId, type: "accept" });

  res.status(200).json({
    status: "success",
    message: "Invitation accepted",
    friends,
  });
});
