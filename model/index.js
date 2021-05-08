// const fs = require('fs/promises')
// const contacts = require('./contacts.json')
const { v4: uuid } = require("uuid");
const db = require("./db");

const listContacts = async () => {
  return db.get("contacts").value();
};

const getContactById = async (contactId) => {
  const id = contactId.toString();
  return db.get("contacts").find({ id }).value();
};

const removeContact = async (contactId) => {
  const id = contactId.toString();
  const [record] = db.get("contacts").remove({ id }).write();
  return record;
};

const addContact = async (body) => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  db.get("contacts").push(record).write();
  return record;
};

const updateContact = async (contactId, body) => {
  const id = contactId.toString();
  const record = db.get("contacts").find({ id }).assign(body).value();

  db.write();
  return record.id ? record : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
