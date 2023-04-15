const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const friendsController = require("../controller/friendsController");
router.route("/").get(authController.protect, friendsController.getFriends);

module.exports = router;
