const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const updateRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_campaign_copilot');
    const user = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      { role: 'Admin' },
      { new: true }
    );
    if (user) {
      console.log('Successfully updated user to Admin:', user.email);
    } else {
      console.log('User test@example.com not found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateRole();
