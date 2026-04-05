/* eslint-disable no-undef */
const ENVIRONMENT = process.env.ENVIRONMENT || "development";
const PORT = process.env.PORT || 8080;
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;
const SECRET = process.env.SECRET || "not-so-secret";
const APP_URL = process.env.APP_URL || "http://localhost:3000";
const ADMIN_URL = process.env.ADMIN_URL || "http://localhost:3001";
const SENTRY_DSN = process.env.SENTRY_DSN || "";

const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const S3_ACCESSKEYID = process.env.S3_ACCESSKEYID || "";
const S3_SECRETACCESSKEY = process.env.S3_SECRETACCESSKEY || "";

const BREVO_KEY = process.env.BREVO_KEY || "";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";
const GOOGLE_WEBHOOK_TOKEN = process.env.GOOGLE_WEBHOOK_TOKEN || "";

const CONFIG = {
  ENVIRONMENT,
  PORT,
  MONGODB_ENDPOINT,
  SECRET,
  APP_URL,
  ADMIN_URL,
  SENTRY_DSN,
  S3_ENDPOINT,
  S3_ACCESSKEYID,
  S3_SECRETACCESSKEY,
  BREVO_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_WEBHOOK_TOKEN,
};

if (ENVIRONMENT === "development") console.log(CONFIG);

module.exports = CONFIG;
