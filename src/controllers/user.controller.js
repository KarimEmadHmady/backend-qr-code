import User from '../models/User.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user (Admin or user themselves)
export const updateUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body; 
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};


// Delete user (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};