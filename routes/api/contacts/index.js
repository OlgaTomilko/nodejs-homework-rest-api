const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");

const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("./validation");

router.get("/", ctrl.listContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateAddContact, ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validateUpdateContact, ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  validateUpdateStatusContact,
  ctrl.updateStatusContact
);

module.exports = router;
