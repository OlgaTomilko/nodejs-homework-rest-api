// const db = require("./db");
// const { ObjectId } = require("mongodb");
const Contact = require("./schemas/contact");

// const getCollection = async (db, name) => {
//   const client = await db;
//   const collection = await client.db().collection(name);
//   return collection;
// };

const listContacts = async () => {
  // const collection = await getCollection(db, "contacts");
  // const results = collection.find({}).toArray();
  const results = await Contact.find({});
  return results;
};

const getContactById = async (contactId) => {
  // const collection = await getCollection(db, "contacts");
  // const [result] = await collection
  //   .find({ _id: new ObjectId(contactId) })
  //   .toArray();
  // // console.log(result._id.getTimestamp());
  const result = await Contact.findOne({ _id: contactId });
  return result;
};

const removeContact = async (contactId) => {
  // const collection = await getCollection(db, "contacts");
  // const { value: result } = await collection.findOneAndDelete({
  //   _id: new ObjectId(contactId),
  // });
  const result = Contact.findByIdAndRemove({ _id: contactId });
  return result;
};

const addContact = async (body) => {
  // const collection = await getCollection(db, "contacts");
  // const record = {
  //   ...body,
  //   ...(body.favorite ? {} : { favorite: false }),
  // };
  // const {
  //   ops: [result],
  // } = await collection.insertOne(record);
  const result = Contact.create(body);
  return result;
};

const updateContact = async (contactId, body) => {
  // const collection = await getCollection(db, "contacts");
  // const { value: result } = await collection.findOneAndUpdate(
  //   {
  //     _id: new ObjectId(contactId),
  //   },
  //   { $set: body },
  //   { returnOriginal: false }
  // );
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
    },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { ...body },
    {
      new: true,
    }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
