require("dotenv").config();
const mongoose = require("mongoose");
require("../services/mongo");

const EventModel = require("../models/event");

async function cleanupBadEvents() {
  try {
    await mongoose.connection.asPromise();

    console.log("Searching for events with 'not-good' in the title...");

    const badEvents = await EventModel.find({ title: { $regex: /not-good/i } });

    if (!badEvents.length) {
      console.log("No bad events found. Database is clean!");
      process.exit(0);
    }

    console.log(`Found ${badEvents.length} bad event(s):`);
    badEvents.forEach((event) => {
      console.log(`  - "${event.title}" (ID: ${event._id})`);
    });

    const result = await EventModel.deleteMany({ title: { $regex: /not-good/i } });
    console.log(`Deleted ${result.deletedCount} event(s).`);

    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

cleanupBadEvents();
