import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['donation', 'delivery', 'volunteer', 'ngo', 'platform'],
    default: 'platform'
  }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;