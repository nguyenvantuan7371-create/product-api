const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Product Model từ thư mục models riêng
const Product = require('./models/Product');

const app = express();
app.use(express.json());

// Kết nối MongoDB Container
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/productdb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Route healthcheck
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

// Các route CRUD
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ pid: req.params.pid }, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));