import express from 'express';
import {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} from '../controllers/notificationController.js';

const router = express.Router();

// Create notification
router.post('/', createNotification);

// Get notifications by user
router.get('/user/:userId', getNotificationsByUser);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/user/:userId/read-all', markAllAsRead);

// Get unread count
router.get('/user/:userId/unread-count', getUnreadCount);

export default router;