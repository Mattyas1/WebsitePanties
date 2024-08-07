import { Router } from "express";
import  Product  from "../mongoose/schemas/Product.mjs";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { scheduleAuctionEnd } from "../utils/auctionfunctions.mjs";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory for storing files
const createProductDir = (productId) => {
  const productUploadDir = path.join(__dirname, '../uploads/products', productId.toString());
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

router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});


router.get('/api/products/:id',async (req,res)=> {
  const {id} = req.params;
  try {
    const product = await Product.findById(id)

    if (!product) {
      // Si le produit n'existe pas, envoyer un code de réponse 404 (Not Found)
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
      startingPrice: req.body.price,
      description: req.body.description,
      auctionDate: req.body.auctionDate,
      apparitionLink: req.body.apparitionLink,
      model: JSON.parse(req.body.model),
      warranty: req.body.warranty,
      size: req.body.size,
      material: req.body.material,
    };
    
    console.log("Model here ",productData.model);

    // Create and save the product instance
    Object.assign(product, productData); // Copy product data to the product instance
    await product.save();

    // Process files and save their paths
    const files = req.files;
    console.log(files)
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imagePaths = files.map(file => path.join('uploads','products', product._id.toString(), file.filename));
    product.images = imagePaths;
    await product.save();

    await scheduleAuctionEnd(product);

    // Send response
    res.status(201).json(product);
  });
});


router.post('/api/products/byIds', async (req, res) => {
  const { productIds } = req.body;

  try {
    const products = await Product.find({ _id: { $in: productIds } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

export default router;
