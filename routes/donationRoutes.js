import express from 'express';
import {
  createDonation,
  getDonationsByDonor,
  getAllDonations,
  updateDonationStatus,
  cancelDonation,
  updateDonationPhotos,
  acceptDonation
} from '../controllers/donationController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create donation
router.post('/', upload.single('foodImage'), createDonation);

// Get all donations for a specific donor
router.get('/donor/:donorId', getDonationsByDonor);

// ✅ Get all donations (for NGO dashboard)
router.get('/', getAllDonations);

// ✅ Update donation status (Accepted, Picked, Delivered)
router.put('/status/:id', updateDonationStatus);

// Cancel a donation
router.put('/cancel/:id', cancelDonation);

// Accept a donation (NGO)
router.put('/:id/accept', acceptDonation);

// Update photos (pickup/delivery)
router.put('/photos/:id', upload.fields([
  { name: 'photoPickup', maxCount: 1 },
  { name: 'photoDelivery', maxCount: 1 }
]), updateDonationPhotos);

export default router;
