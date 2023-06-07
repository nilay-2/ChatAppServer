const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/signUp").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/updatePassword").post(authController.protect, authController.updatePassword);
router.route("/logout").delete(authController.logout);
// verify jwt token before making a socket connection in the frontend

router.route("/verify").get(authController.protect, authController.allowUsersOnDashboard);

module.exports = router;
