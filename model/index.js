const db = require("./db");
const { ObjectId } = require("mongodb");

const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

const listContacts = async () => {
  const collection = await getCollection(db, "contacts");
  const results = collection.find({}).toArray();
  return results;
};

const getContactById = async (contactId) => {
  const collection = await getCollection(db, "contacts");
  const [result] = await collection
    .find({ _id: new ObjectId(contactId) })
    .toArray();
  // console.log(result._id.getTimestamp());
  return result;
};

const removeContact = async (contactId) => {
  const collection = await getCollection(db, "contacts");
  const { value: result } = await collection.findOneAndDelete({
    _id: new ObjectId(contactId),
  });
  return result;
};

const addContact = async (body) => {
  const collection = await getCollection(db, "contacts");
  const record = {
    ...body,
    ...(body.favorite ? {} : { favorite: false }),
  };
  // const {
  //   ops: [result],
  // }
  const result = await collection.insertOne(record);
  // {"status": "success",
  //     "code": 201,
  //     "data": {
  //         "contact": {
  //             "acknowledged": true,
  //             "insertedId": "60a69d74bcd9ad71567327d0"
  //         }
  //     }
  // }
  return result;
};

const updateContact = async (contactId, body) => {
  const collection = await getCollection(db, "contacts");
  const { value: result } = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(contactId),
    },
    { $set: body },
    { returnOriginal: false } // не работает
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
