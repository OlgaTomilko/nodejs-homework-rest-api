const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const {
  validateRegistration,
  validateUpdateSubscription,
} = require("./validation");
const guard = require("../../../helpers/guard");
const limiter = require("../../../helpers/limiter");

router.post("/signup", limiter, validateRegistration, ctrl.reg);
router.post("/login", validateRegistration, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/", guard, validateUpdateSubscription, ctrl.subscription);

module.exports = router;
