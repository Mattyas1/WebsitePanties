import mongoose from "mongoose";

const RefundRequestSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    iban: {
      type: String,
      required: true
    },
    bic: {
      type: String,
      required: true
    },
    accountHolderName: {
      type: String,
      required: true
    },
    accountHolderAddress: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    },
    bankAddress: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  });
  
  // Create the model from the schema
  const RefundRequest = mongoose.model('RefundRequest', RefundRequestSchema);

  export default RefundRequest;