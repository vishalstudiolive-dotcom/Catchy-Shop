import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  deactivateAccount
} from '../controllers/userController.js';

const router = express.Router();

router.use(authenticate); // Protect all user routes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.delete('/deactivate', deactivateAccount);

router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
