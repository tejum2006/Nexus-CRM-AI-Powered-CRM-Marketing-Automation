const mongoose = require('mongoose');
const Activity = require('./models/Activity');

async function updateActivities() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai_campaign_copilot');
    
    // Replace "John Doe" with "Steve Rogers" in activity descriptions
    const activities = await Activity.find({ 
      description: { $regex: /John Doe/i } 
    });

    let count = 0;
    for (const activity of activities) {
      activity.description = activity.description.replace(/John Doe/gi, 'Steve Rogers');
      await activity.save();
      count++;
    }
    
    console.log(`Updated ${count} activities.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateActivities();
