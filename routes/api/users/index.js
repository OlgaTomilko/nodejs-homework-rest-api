const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const {
  validateRegistration,
  validateUpdateSubscription,
} = require("./validation");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const limiter = require("../../../helpers/limiter");

router.get("/verify/:verificationToken", ctrl.verify);
router.post("/signup", limiter, validateRegistration, ctrl.reg);
router.post("/login", validateRegistration, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/", guard, validateUpdateSubscription, ctrl.subscription);
router.patch("/avatars", [guard, upload.single("avatarURL")], ctrl.avatars);

module.exports = router;
