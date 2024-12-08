const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
let database; // Variable untuk menyimpan instance database

// Middleware untuk koneksi MongoDB
let isConnected = false;

app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await client.connect();
      database = client.db("Focus_Time"); // Ganti dengan nama database Anda
      isConnected = true;
    }
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Database connection error");
  }
});

// Routes
// 1. **Read All Data** dari koleksi tertentu
app.get('/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  try {
    const collection = database.collection(collectionName);
    const data = await collection.find({}).limit(10).skip(0).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).send("Error reading data");
  }
});

// 2. **Create Data** di koleksi tertentu
app.post('/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  const newData = req.body;
  try {
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(newData);
    res.status(201).json({ message: "Data inserted", id: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data");
  }
});

// 3. **Read Data by ID** di koleksi tertentu
app.get('/:collectionName/:id', async (req, res) => {
  const { collectionName, id } = req.params;
  try {
    const collection = database.collection(collectionName);
    const data = await collection.findOne({ _id: new ObjectId(id) });
    if (!data) {
      return res.status(404).send("Data not found");
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading data by ID:", error);
    res.status(500).send("Error reading data by ID");
  }
});

// 4. **Update Data by ID** di koleksi tertentu
app.put('/:collectionName/:id', async (req, res) => {
  const { collectionName, id } = req.params;
  const updatedData = req.body;
  try {
    const collection = database.collection(collectionName);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).send("Data not found");
    }
    res.status(200).json({ message: "Data updated", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Error updating data");
  }
});

// 5. **Delete Data by ID** di koleksi tertentu
app.delete('/:collectionName/:id', async (req, res) => {
  const { collectionName, id } = req.params;
  try {
    const collection = database.collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send("Data not found");
    }
    res.status(200).json({ message: "Data deleted" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).send("Error deleting data");
  }
});

app.get('/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  try {
    console.log("Connecting to MongoDB...");
    const collection = database.collection(collectionName);
    console.log(`Fetching data from collection: ${collectionName}`);
    const data = await collection.find({}).toArray();
    console.log("Data fetched successfully");
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
