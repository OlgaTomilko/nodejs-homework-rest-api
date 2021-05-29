const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const { validateRegistration } = require("./validation");
const guard = require("../../../helpers/guard");

router.post("/signup", validateRegistration, ctrl.reg);
router.post("/login", validateRegistration, ctrl.login);
router.post("/logout", guard, ctrl.logout);

module.exports = router;
