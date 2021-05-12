// const fs = require("fs/promises");
// const contacts = require("./contacts.json");

const { v4: uuid } = require("uuid");
const db = require("./db");

const listContacts = async () => {
  // console.log(db.get("contacts").value());
  // return db.get("contacts").value();
  // console.log(db.getState());
  return db.getState();
};

const getContactById = async (contactId) => {
  // const id = contactId.toString();
  // return db.get("contacts").find({ id }).value();
  return db.getState().find(({ id }) => id.toString() === contactId);
};

const removeContact = async (contactId) => {
  // const id = contactId.toString();
  // const [record] = db.get("contacts").remove({ id }).write();
  // return record;
  // const id = contactId.toString();
  const contact = db.getState().filter(({ id }) => id.toString() === contactId);
  const record = db.getState().filter(({ id }) => id.toString() !== contactId);
  db.setState(record).write();
  return contact;
};

const addContact = async (body) => {
  // const id = uuid();
  // const record = {
  //   id,
  //   ...body,
  // };
  // db.get("contacts").push(record).write();
  // return record;
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
  // const id = contactId.toString();
  // const record = db.get("contacts").find({ id }).assign(body).value();
  // db.write();
  // return record.id ? record : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
