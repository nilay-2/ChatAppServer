const express = require("express");
const notificationController = require("../controller/notificationController");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect);
router.route("/:id/markAsRead").patch(notificationController.markAsRead);
router.route("/markAllAsRead").patch(notificationController.markAllAsRead);
module.exports = router;
