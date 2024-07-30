import mongoose from "mongoose";

const BidHistorySchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName : {
      type: String,
      required: true
    },
    bidAmount: {
      type: Number,
      required: true
    },
    bidDate: {
      type: Date,
      default: Date.now
    }
  });

  const NotificationSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });

const UserSchema = new mongoose.Schema({
    
    birthDate: {
        type: Date,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    resetPassword: {
        token: { type: String },
        expires: { type: Date },
        },
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    refreshToken : {
        type: mongoose.Schema.Types.String,
    },
    coins: {
        type: mongoose.Schema.Types.Number,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'partner'], 
        default: 'user' 
    },
    bidHistory: [BidHistorySchema],
    notifications: [NotificationSchema],
});

const User = mongoose.model('User', UserSchema);

export default User;