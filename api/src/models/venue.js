const mongoose = require("mongoose");

const MODELNAME = "venue";

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Location
    address: { type: String, trim: true },
    city: { type: String, trim: true },

    // Capacity
    capacity: { type: Number, default: 0 },

    // Amenities (e.g. ["WiFi", "Parking", "Stage"])
    amenities: [{ type: String, trim: true }],

    // Image
    image_url: { type: String, default: "" },

    // Owner
    owner_id: { type: String, ref: "user", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

Schema.index({ name: "text", city: "text", address: "text" });

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
