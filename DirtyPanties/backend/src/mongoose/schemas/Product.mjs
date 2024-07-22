import mongoose from 'mongoose';

// Main Product Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Clothing', 'Toy'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    type: String, // URL des images
    trim: true,
  }],
  auctionDate: {
    type: Date,
    required: true,
  },
  apparitionLink: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Apparition link must be a valid URL',
    },
    required: true,
  },
  // Category-specific fields
  model: {
    type: String,
    trim: true,
  },
  warranty: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  material: {
    type: String,
    trim: true,
  },
});

// Middleware to handle category-specific validation
ProductSchema.pre('save', function(next) {
  // Remove properties that are not relevant for the current category
  if (this.category === 'Toy') {
    this.size = undefined;
    this.material = undefined;
  } else if (this.category === 'Clothing') {
    this.model = undefined;
    this.warranty = undefined;
  }

  next();
});

export const Product = mongoose.model('Product', ProductSchema);
