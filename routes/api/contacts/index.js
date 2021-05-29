const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("./validation");

router.get("/", guard, ctrl.listContacts);

router.get("/:contactId", guard, ctrl.getContactById);

router.post("/", guard, validateAddContact, ctrl.addContact);

router.delete("/:contactId", guard, ctrl.removeContact);

router.put("/:contactId", guard, validateUpdateContact, ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  guard,
  validateUpdateStatusContact,
  ctrl.updateStatusContact
);

module.exports = router;
