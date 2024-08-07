import {Router} from "express";
import "../strategies/local-strategy.mjs";
import User from "../mongoose/schemas/User.mjs"
import PartnerApplication from "../mongoose/schemas/PartnerApplication.mjs"
import { fileURLToPath } from 'url';
import path from "path";
import multer from "multer";
import fs from "fs";


const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createApplicationDir = (userId) => {
  const applicationUploadDir = path.join(__dirname, '../uploads/applications', userId.toString());
  if (!fs.existsSync(applicationUploadDir)) {
    fs.mkdirSync(applicationUploadDir, { recursive: true });
  }
  return applicationUploadDir;
};

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

// Middleware to handle file uploads and set req.uploadDir
const uploadMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: 'User ID not found in session' });
  }
  req.uploadDir = createApplicationDir(req.session.userId);
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

router.post('/api/partner/application',uploadMiddleware, async (req, res) => {
  try {
    // Extract application data from form fields (non-file fields)
    const applicationData = {
      userId: req.session.userId,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      post: req.body.post,
      status: 'submitted',
      submissionDate: new Date(),
      reviewDate: null,
      comments: []
    };
      // Check if an application from the same user already exists
    const existingApplication = await PartnerApplication.findOne({ userId: req.session.userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Application already exists for this user' });
    }

    const partnerApplication = new PartnerApplication(applicationData);
    await partnerApplication.save();

    // Process files and save their paths
    const files = req.files;
    if (files && files.length > 0) {
      const imagePaths = files.map(file => path.join('uploads', 'applications', req.session.userId.toString(), file.filename));
      partnerApplication.images = imagePaths;
      await partnerApplication.save();
    }

    res.status(201).json(partnerApplication);
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ message: 'Error saving application', error });
  }
});

router.put('/api/partner/application', uploadMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;

    const existingApplication = await PartnerApplication.findOne({ userId });

    if (!existingApplication) {
      return res.status(404).json({ message: 'Application not found for this user' });
    }

    const applicationData = {
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      post: req.body.post,
      status: 'submitted', 
      submissionDate: new Date(), 
      reviewDate: null,
      comments: [] 
    };

    // Delete existing images from file system
    const existingImages = existingApplication.images;
    if (existingImages && existingImages.length > 0) {
      existingImages.forEach(imagePath => {
        const fullImagePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
        }
      });
    }

    await PartnerApplication.updateOne({ userId }, { $set: applicationData });

    const files = req.files;
    if (files && files.length > 0) {
      const newImagePaths = files.map(file => path.join('uploads', 'applications', userId.toString(), file.filename));
      
      await PartnerApplication.updateOne({ userId }, { $set: { images: newImagePaths } });
    }

    const updatedApplication = await PartnerApplication.findOne({ userId });
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Error updating application', error });
  }
});

router.delete('/api/partner/application', async (req, res) => {
  try {
    const userId = req.session.userId;

    // Find the existing application
    const existingApplication = await PartnerApplication.findOne({ userId });

    if (!existingApplication) {
      return res.status(404).json({ message: 'Application not found for this user' });
    }

    // Delete existing images from file system
    const existingImages = existingApplication.images;
    if (existingImages && existingImages.length > 0) {
      existingImages.forEach(imagePath => {
        const fullImagePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
        }
      });
    }

    // Delete the application from the database
    await PartnerApplication.deleteOne({ userId });

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Error deleting application', error });
  }
});

router.get('/api/partner/application', async (req, res) => {
  try {
    const userId = req.session.userId;
    const application = await PartnerApplication.findOne({ userId });

    if (application) {
      res.status(200).json(application);
    } else {
      res.status(204).send(); // No content if no application found
    }
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/api/partner', async (req, res) => {
    try {
      const partners = await User.find({ role: 'partner' }).select('username _id');
      res.status(200).json(partners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/api/partner/:partnerId', async (req, res) => {
    try {
      // Fetch partner details and populate sellingProducts with Product details
      const partner = await User.findById(req.params.partnerId)
        .select('username sellingProducts')
        .populate({
          path: 'sellingProducts.productId',
          select: 'name images startingPrice bid auctionDate',
        });
  
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  
      res.status(200).json(partner);
    } catch (error) {
      console.error('Error fetching partner:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/api/users/:userId/subscribe', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { partnerId } = req.body;

    // Ensure the user is authenticated (e.g., check session)
    if (!req.session.userId || req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const partner = await User.findById(partnerId).select('username');
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Check if the user is already subscribed to the partner
    if (user.subscribedPartners.some(sp => sp.userId.toString() === partnerId)) {
      return res.status(400).json({ message: 'Already subscribed to this partner' });
    }

    // Add the partner to the user's subscribedPartners
    user.subscribedPartners.push({
      userId: partnerId,
      username: partner.username,
    });

    await user.save();
    
    res.status(200).json({ message: 'Subscribed successfully', subscribedPartners: user.subscribedPartners });
  } catch (error) {
    console.error('Error subscribing to partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  export default router;