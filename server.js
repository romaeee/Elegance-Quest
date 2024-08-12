const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://romaeee:<password>@cluster0.8wmo1.mongodb.net/Game-Test?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

client.connect().then(() => {
  console.log("Connected to MongoDB");

  const db = client.db("tele_app");
  const collection = db.collection("clicks");

  // Получить количество кликов по userId
  app.get('/get-count', async (req, res) => {
    const userId = req.query.userId;
    const user = await collection.findOne({ userId: parseInt(userId) });
    res.json(user ? user.count : 0);
  });

  // Сохранить количество кликов по userId
  app.post('/save-count', async (req, res) => {
    const { userId, count } = req.body;
    await collection.updateOne(
      { userId: parseInt(userId) },
      { $set: { count } },
      { upsert: true }
    );
    res.json({ success: true });
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(console.error);
