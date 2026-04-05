const cron = require("node-cron");
const EventModel = require("../models/event");
const { sendEmail } = require("../services/brevo");

function start() {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("[CRON] Checking for events starting in the next 24 hours...");

      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const events = await EventModel.find({
        start_date: { $gte: now, $lte: in24h },
        status: "published",
      });

      if (!events.length) {
        console.log("[CRON] No upcoming events found.");
        return;
      }

      console.log(`[CRON] Found ${events.length} event(s) starting soon.`);

      for (const event of events) {
        if (!event.organizer_email) continue;

        await sendEmail(
          [{ email: event.organizer_email, name: event.organizer_name }],
          `Reminder: "${event.title}" starts soon!`,
          `<h2>Event Reminder</h2>
          <p>Your event <strong>${event.title}</strong> is starting soon.</p>
          <p><strong>Date:</strong> ${event.start_date.toLocaleString()}</p>
          <p><strong>Venue:</strong> ${event.venue || "TBD"}</p>
          <p><strong>City:</strong> ${event.city || "TBD"}</p>`,
        );

        console.log(`[CRON] Reminder sent for "${event.title}" to ${event.organizer_email}`);
      }
    } catch (error) {
      console.error("[CRON] Error in event reminders:", error);
    }
  });

  console.log("[CRON] Event reminders cron job started (runs every hour).");
}

module.exports = { start };
