const express = require("express");
const router = express.Router();

const { GOOGLE_WEBHOOK_TOKEN } = require("../config");
const { capture } = require("../services/sentry");

router.post("/calendar-sync", async (req, res) => {
  try {
    const channelToken = req.headers["x-goog-channel-token"];
    const resourceState = req.headers["x-goog-resource-state"];
    const channelId = req.headers["x-goog-channel-id"];
    const resourceId = req.headers["x-goog-resource-id"];

    if (GOOGLE_WEBHOOK_TOKEN && channelToken !== GOOGLE_WEBHOOK_TOKEN) {
      console.log("Google Calendar webhook: invalid token, ignoring.");
      return res.status(401).send({ ok: false, code: "INVALID_TOKEN" });
    }

    if (resourceState === "sync") {
      console.log("Google Calendar webhook: sync handshake received.");
      return res.status(200).send({ ok: true });
    }

    console.log("Google Calendar webhook: notification received.", { resourceState, channelId, resourceId });

    return res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false });
  }
});

module.exports = router;
