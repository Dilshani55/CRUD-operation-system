const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();           // make sure this line is here

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/products', productRoutes);

// read from .env
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

console.log('MONGO_URI from .env:', MONGO_URI); // temporary debug line

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('DB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});