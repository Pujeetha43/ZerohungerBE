import Sponsor from '../models/Sponsor.js';
import User from '../models/User.js';

// Create sponsor profile
export const createSponsorProfile = async (req, res) => {
  try {
    const { userId, companyName, contactPerson, contactEmail, contactPhone, sponsorshipType, amount, description } = req.body;

    // Check if user exists and is a sponsor
    const user = await User.findById(userId);
    if (!user || user.role !== 'sponsor') {
      return res.status(400).json({ message: 'Invalid user or user is not a sponsor' });
    }

    // Check if sponsor profile already exists
    const existingSponsor = await Sponsor.findOne({ userId });
    if (existingSponsor) {
      return res.status(400).json({ message: 'Sponsor profile already exists' });
    }

    const sponsor = new Sponsor({
      userId,
      companyName,
      contactPerson,
      contactEmail,
      contactPhone,
      sponsorshipType,
      amount,
      description
    });

    const saved = await sponsor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating sponsor profile', error: err.message });
  }
};

// Get sponsor profile
export const getSponsorProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const sponsor = await Sponsor.findOne({ userId });
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor profile not found' });
    }
    res.status(200).json(sponsor);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sponsor profile', error: err.message });
  }
};

// Update sponsor profile
export const updateSponsorProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const updated = await Sponsor.findOneAndUpdate(
      { userId },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Sponsor profile not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating sponsor profile', error: err.message });
  }
};

// Get all sponsors
export const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(sponsors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sponsors', error: err.message });
  }
};

// Get sponsor impact statistics
export const getSponsorImpact = async (req, res) => {
  try {
    const { userId } = req.params;

    // This would typically aggregate data from donations/deliveries
    // For now, return basic sponsor info
    const sponsor = await Sponsor.findOne({ userId });
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor profile not found' });
    }

    // Mock impact data - in real app, calculate from actual data
    const impact = {
      totalAmount: sponsor.amount,
      peopleFed: Math.floor(sponsor.amount / 50), // Assuming $50 feeds one person
      donationsSupported: Math.floor(sponsor.amount / 100), // Assuming $100 per donation
      activeSince: sponsor.createdAt
    };

    res.status(200).json({ sponsor, impact });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sponsor impact', error: err.message });
  }
};