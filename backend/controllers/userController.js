import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken -resetPasswordToken -resetPasswordExpire -otp -otpExpire');
    res.json({ user });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, gender, avatar } = req.body;
    let updatable = { name, phone, gender };
    if (avatar) updatable.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updatable, { new: true }).select('-password -refreshToken -otp');
    res.json({ user });
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // If OAuth user tries to change password without having one initially
    if (!user.password) {
      user.password = newPassword;
      await user.save();
      return res.json({ message: 'Password created successfully' });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) { next(err); }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.isActive = false;
    await user.save();
    res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    res.json({ message: 'Account deactivated successfully' });
  } catch (err) { next(err); }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.addresses.length >= 5) {
      return res.status(400).json({ error: 'Maximum 5 addresses allowed' });
    }
    if (req.body.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => a.isDefault = false);
      req.body.isDefault = true;
    }
    user.addresses.push(req.body);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) { next(err); }
};

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ error: 'Address not found' });
    
    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    Object.assign(addr, req.body);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) { next(err); }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) { next(err); }
};
