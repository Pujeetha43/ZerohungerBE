import Notification from '../models/Notification.js';

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId, relatedModel } = req.body;

    const notification = new Notification({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedModel
    });

    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
};

// Get notifications for a user
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications', error: err.message });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching unread count', error: err.message });
  }
};