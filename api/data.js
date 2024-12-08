const { ObjectId } = require('mongodb');

// Fungsi untuk mencari data berdasarkan ID
const findById = async (collection, id) => {
  return await collection.findOne({ _id: new ObjectId(id) });
};

// Fungsi untuk membuat data baru
const createData = async (collection, data) => {
  return await collection.insertOne(data);
};

// Export fungsi
module.exports = {
  findById,
  createData
};
