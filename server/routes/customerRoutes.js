const express = require('express');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addNote,
  getTags,
  exportCustomers,
  importCustomers
} = require('../controllers/customerController');

const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    // Check extension and mime type
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    
    if (extname === '.csv' && (mimetype === 'text/csv' || mimetype === 'application/vnd.ms-excel')) {
      return cb(null, true);
    }
    cb(new Error('Only CSV files are allowed'));
  }
});

// Apply auth middleware to all customer routes
router.use(protect);

router.get('/export', authorize('Admin'), exportCustomers);
router.post('/import', authorize('Admin'), upload.single('file'), importCustomers);

router
  .route('/')
  .get(getCustomers)
  .post(createCustomer);

router.get('/tags/all', getTags);

router
  .route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(authorize('Admin'), deleteCustomer);

router
  .route('/:id/notes')
  .post(addNote);

module.exports = router;
