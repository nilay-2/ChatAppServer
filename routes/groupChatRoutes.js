const express = require("express");
const groupChatController = require("../controller/groupChatController");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/createGroup").post(authController.protect, groupChatController.createGroup);
router.route("/:id/chats").get(authController.protect, groupChatController.getRealTimeGroupChatMessages);
module.exports = router;
