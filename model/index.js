const { v4: uuid } = require("uuid");
const db = require("./db");

const listContacts = async () => {
  return db.getState();
};

const getContactById = async (contactId) => {
  return db.getState().find(({ id }) => id.toString() === contactId);
};

const removeContact = async (contactId) => {
  const contact = db.getState().filter(({ id }) => id.toString() === contactId);
  const record = db.getState().filter(({ id }) => id.toString() !== contactId);
  db.setState(record).write();
  return contact;
};

const addContact = async (body) => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  db.setState([...db.getState(), record]).write();
  return record;
};

const updateContact = async (contactId, body) => {
  const contact = db.getState().find(({ id }) => id.toString() === contactId);
  const updatedContact = { ...contact, ...body };

  updatedContact.id
    ? db
        .setState([
          ...db.getState().filter(({ id }) => id.toString() !== contactId),
          updatedContact,
        ])
        .write()
    : db.setState([...db.getState()]).write();

  return updatedContact.id ? updatedContact : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
