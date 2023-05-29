const express = require("express");
const router = express.Router();
const serverStore = require("../serverStore");
const authController = require("../controller/authController");
const socket = serverStore.getSocketIoInstance();
const directChatController = require("../controller/directChatController");

router.use(authController.protect);

router.route("/:chosenChatId").post(directChatController.getChatHistory);

router.route("/delete/:messageId").delete(directChatController.deleteMessage);

module.exports = router;
