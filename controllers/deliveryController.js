import Delivery from '../models/Delivery.js';
import Donation from '../models/Donation.js';

// Create a new delivery
export const createDelivery = async (req, res) => {
  try {
    const { donationId, volunteerId, ngoId } = req.body;

    // Check if donation exists and is accepted
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'Accepted') {
      return res.status(400).json({ message: 'Donation must be accepted before creating delivery' });
    }

    const delivery = new Delivery({
      donationId,
      volunteerId,
      ngoId
    });

    const saved = await delivery.save();

    // Update donation status to indicate it's assigned for delivery
    await Donation.findByIdAndUpdate(donationId, { status: 'Picked' });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating delivery', error: err.message });
  }
};

// Get deliveries by volunteer
export const getDeliveriesByVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const deliveries = await Delivery.find({ volunteerId })
      .populate('donationId')
      .populate('ngoId', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
  }
};

// Get deliveries by NGO
export const getDeliveriesByNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const deliveries = await Delivery.find({ ngoId })
      .populate('donationId')
      .populate('volunteerId', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pickupTime, deliveryTime, notes } = req.body;

    const updateData = { status };
    if (pickupTime) updateData.pickupTime = pickupTime;
    if (deliveryTime) updateData.deliveryTime = deliveryTime;
    if (notes) updateData.notes = notes;

    const updated = await Delivery.findByIdAndUpdate(id, updateData, { new: true });

    // If delivery is completed, update donation status
    if (status === 'Delivered') {
      await Donation.findByIdAndUpdate(updated.donationId, { status: 'Delivered' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating delivery', error: err.message });
  }
};

// Update delivery photos
export const updateDeliveryPhotos = async (req, res) => {
  try {
    const { id } = req.params;

    const pickupPhoto = req.files.pickupPhoto ? req.files.pickupPhoto[0].path : undefined;
    const deliveryPhoto = req.files.deliveryPhoto ? req.files.deliveryPhoto[0].path : undefined;

    const updated = await Delivery.findByIdAndUpdate(
      id,
      {
        ...(pickupPhoto && { pickupPhoto }),
        ...(deliveryPhoto && { deliveryPhoto })
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating delivery photos', error: err.message });
  }
};