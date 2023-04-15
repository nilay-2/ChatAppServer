const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();
const friendInvitationController = require("../controller/friendInvitationController");
router.route("/invite").post(authController.protect, friendInvitationController.sendInvite);

router.route("/reject").post(authController.protect, friendInvitationController.rejectInvitation);
router.route("/accept").post(authController.protect, friendInvitationController.acceptInvitation);
module.exports = router;
