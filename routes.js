// routes.js
const express = require('express');
const router = express.Router();
const Product = require('./productModel');
const upload = require('./upload');

// Route to get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new product
router.post('/products', upload.single('image'), async (req, res) => {
  const { name, price, text,type } = req.body;
  const image = req.file.path; // Multer stores the image path in `req.file.path`
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const newProduct = new Product({
    name,
    price,
    text,
    image,
    type
  });

  try {
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get a single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update a product by ID
router.put('/products/:id', upload.single('image'), async (req, res) => {
  const { name, price, text,type } = req.body;
  const image = req.file ? req.file.path : null; // Only update image if new one is provided

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.text = text || product.text;
    product.type=type || product.type;
    if (image) {
      product.image = image;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
