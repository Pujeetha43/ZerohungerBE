import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  companyName: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  sponsorshipType: {
    type: String,
    enum: ['financial', 'food', 'logistics', 'other'],
    default: 'financial'
  },
  amount: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

export default Sponsor;