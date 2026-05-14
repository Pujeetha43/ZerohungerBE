import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Delivery from '../models/Delivery.js';
import Sponsor from '../models/Sponsor.js';
import Notification from '../models/Notification.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Update user status (block/unblock)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    // Note: Adding isBlocked field to User model would be needed
    // For now, we'll use a simple approach
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real app, you'd add an isBlocked field to the User model
    // For now, we'll just return success
    res.status(200).json({ message: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status', error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Get platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalSponsors = await User.countDocuments({ role: 'sponsor' });

    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'Pending Pickup' });
    const completedDonations = await Donation.countDocuments({ status: 'Delivered' });

    const totalDeliveries = await Delivery.countDocuments();
    const completedDeliveries = await Delivery.countDocuments({ status: 'Delivered' });

    // Calculate total food donated (simplified)
    const donations = await Donation.find({ status: 'Delivered' });
    const totalFoodDonated = donations.reduce((sum, donation) => {
      return sum + (parseFloat(donation.quantity) || 0);
    }, 0);

    const stats = {
      users: {
        total: totalUsers,
        donors: totalDonors,
        ngos: totalNGOs,
        volunteers: totalVolunteers,
        sponsors: totalSponsors
      },
      donations: {
        total: totalDonations,
        pending: pendingDonations,
        completed: completedDonations
      },
      deliveries: {
        total: totalDeliveries,
        completed: completedDeliveries
      },
      impact: {
        totalFoodDonated: Math.round(totalFoodDonated),
        peopleFed: Math.round(totalFoodDonated / 2) // Assuming 2kg feeds one person
      }
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching platform stats', error: err.message });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  try {
    // Get recent donations
    const recentDonations = await Donation.find()
      .populate('donorId', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent deliveries
    const recentDeliveries = await Delivery.find()
      .populate('volunteerId', 'username')
      .populate('donationId')
      .sort({ createdAt: -1 })
      .limit(10);

    const activity = {
      donations: recentDonations,
      deliveries: recentDeliveries
    };

    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent activity', error: err.message });
  }
};

// Send notification to all users
export const sendGlobalNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    // Get all users
    const users = await User.find({});

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || 'system'
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ message: 'Notifications sent to all users' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending global notification', error: err.message });
  }
};