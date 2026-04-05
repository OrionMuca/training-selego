const fetch = require("node-fetch");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = require("../config");

const TIMEZONE = "Europe/Paris";
const hasCredentials = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN;

const getAccessToken = async () => {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();

  if (!data.access_token) throw new Error(`Failed to get Google access token: ${JSON.stringify(data)}`);

  return data.access_token;
};

const formatCalendarEvent = (event) => ({
  summary: event.title,
  description: event.description || "",
  location: [event.venue, event.city, event.country].filter(Boolean).join(", "),
  start: { dateTime: new Date(event.start_date).toISOString(), timeZone: TIMEZONE },
  end: { dateTime: new Date(event.end_date || event.start_date).toISOString(), timeZone: TIMEZONE },
});

const createEvent = async (event) => {
  if (!hasCredentials) {
    console.log("Google Calendar: missing credentials, skipping export.");
    return;
  }

  const accessToken = await getAccessToken();

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(formatCalendarEvent(event)),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(`Google Calendar API error: ${JSON.stringify(data)}`);

  console.log(`Google Calendar: event created successfully. Google event ID: ${data.id}`);
  return data;
};

const updateEvent = async (googleEventId, event) => {
  if (!hasCredentials) {
    console.log("Google Calendar: missing credentials, skipping update.");
    return;
  }

  const accessToken = await getAccessToken();

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(formatCalendarEvent(event)),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(`Google Calendar update error: ${JSON.stringify(data)}`);

  console.log(`Google Calendar: event updated successfully. Google event ID: ${data.id}`);
  return data;
};

module.exports = { createEvent, updateEvent };
