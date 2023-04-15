const express = require("express");
const router = express.Router();
const serverStore = require("../serverStore");

const socket = serverStore.getSocketIoInstance();
const directChatController = require("../controller/directChatController");
router.route("/:chosenChatId").post(directChatController.getChatHistory);

module.exports = router;
