const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const { validateRegistration } = require("./validation");
const guard = require("../../../helpers/guard");
const limiter = require("../../../helpers/limiter");

router.post("/signup", limiter, validateRegistration, ctrl.reg);
router.post("/login", validateRegistration, ctrl.login);
router.post("/logout", guard, ctrl.logout);

module.exports = router;
