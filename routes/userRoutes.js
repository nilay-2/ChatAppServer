const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/signUp").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").delete(authController.logout);

router.use(authController.protect);

router.route("/updatePassword").patch(authController.updatePassword);
// verify jwt token before making a socket connection in the frontend

// upload profile picture route
router.route("/uploadProfileImg").post(authController.fileParser, authController.resizeImg);

router.route("/updatePFP").patch(authController.updateProfilePic);

router.route("/verify").get(authController.allowUsersOnDashboard);

router.route("/updateNameAndEmail").patch(authController.updateNameAndEmail);

module.exports = router;
