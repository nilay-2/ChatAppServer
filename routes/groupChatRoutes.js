const express = require("express");
const groupChatController = require("../controller/groupChatController");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect);

router.route("/createGroup").post(groupChatController.createGroup);
router.route("/:id/chats").get(groupChatController.getRealTimeGroupChatMessages);
router.route("/:groupId/delete/:messageId").delete(groupChatController.deleteGroupChatMessage);
module.exports = router;
