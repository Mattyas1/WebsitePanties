import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PartnerApplicationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    post: {
      type: String,
      required: true,
      trim: true
    },
    images: [{
      type: String,
      required: true
    }],
    status: {
      type: String,
      enum: ['submitted', 'in review', 'approved', 'rejected'],
      default: 'submitted'
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    reviewDate: Date,
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  });
  
  // Indexes
  PartnerApplicationSchema.index({ userId: 1 }, { unique: true });

  const PartnerApplication = mongoose.model('PartnerApplication', PartnerApplicationSchema);

  export default PartnerApplication