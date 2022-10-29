const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB = process.env.MONGO_DB;
const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect(MONGO_URL, { dbName: MONGO_DB }, (err) => {
  if (err) console.error(err);
  else console.log('Connected to MongoDB');
});

const users = require('./routes/users');
const posts = require('./routes/posts');
const likes = require('./routes/likes');
const follows = require('./routes/follows');

app.use('/users', users);
app.use('/posts', posts);
app.use('/likes', likes);
app.use('/follows', follows);
app.use((_, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
