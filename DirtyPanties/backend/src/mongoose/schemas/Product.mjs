import mongoose from 'mongoose';


const BidSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  bidderId: { type: String, default: '' },
  date: { type: Date, default: Date.now },
});
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
  startingPrice: {
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
  isSold: {
    type: Boolean,
    required: true,
    default: false,
  },
  apparitionLink: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Apparition link must be a valid URL',
    },
    required: false,
  },
  model: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true,
    },
    username: {
      type: String,
      required: true,
    }
  },
  bid: BidSchema,
  
  bidHistory : [BidSchema],

  // Category-specific fields
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
    this.warranty = undefined;
  }

  next();
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
