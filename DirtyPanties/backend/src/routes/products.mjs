import { Router } from "express";
import { Product } from "../mongoose/schemas/Product.mjs";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory for storing files
const createProductDir = (productId) => {
  const productUploadDir = path.join(__dirname, '../uploads', productId.toString());
  if (!fs.existsSync(productUploadDir)) {
    fs.mkdirSync(productUploadDir, { recursive: true });
  }
  return productUploadDir;
};

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.uploadDir) {
      // Ensure req.uploadDir is defined
      return cb(new Error('Upload directory not defined'));
    }
    cb(null, req.uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware to handle file uploads and form data
router.post('/api/products/new', (req, res) => {
  // Step 1: Create an initial product instance
  const product = new Product();

  // Ensure req.uploadDir is defined and create directory
  req.uploadDir = createProductDir(product._id);

  // Step 2: Use multer middleware to handle file uploads
  upload.array('images', 10)(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

    // Extract product data from form fields (non-file fields)
    const productData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      auctionDate: req.body.auctionDate,
      apparitionLink: req.body.apparitionLink,
      model: req.body.model,
      warranty: req.body.warranty,
      size: req.body.size,
      material: req.body.material,
    };

    // Create and save the product instance
    Object.assign(product, productData); // Copy product data to the product instance
    await product.save();

    // Process files and save their paths
    const files = req.files;
    console.log(files)
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imagePaths = files.map(file => path.join('uploads', product._id.toString(), file.filename));
    product.images = imagePaths;
    await product.save();

    // Send response
    res.status(201).json(product);
  });
});

router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

export default router;
