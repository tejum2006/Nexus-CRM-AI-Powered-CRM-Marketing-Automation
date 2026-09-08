require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const duplicates = await Customer.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    if (duplicates.length > 0) {
      console.log('Found duplicate emails:');
      for (const dup of duplicates) {
        console.log(`Email: ${dup._id}, Count: ${dup.count}, IDs: ${dup.ids.join(', ')}`);
        
        // Remove older duplicates (keep the first one)
        const idsToDelete = dup.ids.slice(1);
        await Customer.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`Deleted ${idsToDelete.length} duplicate records for ${dup._id}`);
      }
    } else {
      console.log('No duplicate emails found.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
