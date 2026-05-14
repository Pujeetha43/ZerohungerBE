import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Donation'
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Failed'],
    default: 'Assigned'
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  pickupPhoto: {
    type: String,
    default: ''
  },
  deliveryPhoto: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;