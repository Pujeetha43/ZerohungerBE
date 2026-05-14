import express from 'express';
import {
  createSponsorProfile,
  getSponsorProfile,
  updateSponsorProfile,
  getAllSponsors,
  getSponsorImpact
} from '../controllers/sponsorController.js';

const router = express.Router();

// Create sponsor profile
router.post('/', createSponsorProfile);

// Get sponsor profile
router.get('/:userId', getSponsorProfile);

// Update sponsor profile
router.put('/:userId', updateSponsorProfile);

// Get all sponsors
router.get('/', getAllSponsors);

// Get sponsor impact
router.get('/:userId/impact', getSponsorImpact);

export default router;