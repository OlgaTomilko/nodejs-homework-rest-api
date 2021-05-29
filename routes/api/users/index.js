const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const { validateRegistration } = require("./validation");

router.post("/signup", validateRegistration, ctrl.reg);
router.post("/login", validateRegistration, ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;
