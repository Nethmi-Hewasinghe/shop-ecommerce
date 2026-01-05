// In userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { authUser, registerUser, getUsers } = require('../controllers/userController');

router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

router.post('/login', authUser);

// Test route to get all users
router.get('/test-users', async (req, res) => {
    try {
        const users = await User.find({});
        console.log('Users from database:', users);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;