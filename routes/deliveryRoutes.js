import express from 'express';
import {
  createDelivery,
  getDeliveriesByVolunteer,
  getDeliveriesByNGO,
  updateDeliveryStatus,
  updateDeliveryPhotos
} from '../controllers/deliveryController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create delivery
router.post('/', createDelivery);

// Get deliveries by volunteer
router.get('/volunteer/:volunteerId', getDeliveriesByVolunteer);

// Get deliveries by NGO
router.get('/ngo/:ngoId', getDeliveriesByNGO);

// Update delivery status
router.put('/:id/status', updateDeliveryStatus);

// Update delivery photos
router.put('/:id/photos', upload.fields([
  { name: 'pickupPhoto', maxCount: 1 },
  { name: 'deliveryPhoto', maxCount: 1 }
]), updateDeliveryPhotos);

export default router;