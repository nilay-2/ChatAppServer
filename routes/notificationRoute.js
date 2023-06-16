const express = require("express");
const notificationController = require("../controller/notificationController");
const directChatNotificationController = require("../socketHandler/directChats/directChatNotification");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect);
router.route("/:id/markAsRead").patch(notificationController.markAsRead);
router.route("/markAllAsRead").patch(notificationController.markAllAsRead);
router.route("/chat/markAllAsRead").delete(directChatNotificationController.deleteChatNotifications);
module.exports = router;
