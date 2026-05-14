import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getPlatformStats,
  getRecentActivity,
  sendGlobalNotification
} from '../controllers/adminController.js';

const router = express.Router();

// Get all users
router.get('/users', getAllUsers);

// Update user status
router.put('/users/:userId/status', updateUserStatus);

// Delete user
router.delete('/users/:userId', deleteUser);

// Get platform statistics
router.get('/stats', getPlatformStats);

// Get recent activity
router.get('/activity', getRecentActivity);

// Send global notification
router.post('/notifications/global', sendGlobalNotification);

export default router;