const express = require('express');
const {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect and authorize('Admin') to ALL routes in this file
router.use(protect);
router.use(authorize('Admin'));

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .delete(deleteUser);

router.put('/:id/role', updateUserRole);

module.exports = router;
