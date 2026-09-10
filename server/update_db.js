const mongoose = require('mongoose');
const Customer = require('./models/Customer');

async function updateDb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai_campaign_copilot');
    
    // Update all occurrences of John Doe to Steve Rogers
    const result = await Customer.updateMany(
      { name: { $regex: /John Doe/i } },
      { 
        $set: { 
          name: 'Steve Rogers',
          email: 'steve@example.com' 
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} customers.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateDb();
