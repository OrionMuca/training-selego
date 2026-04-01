const express = require("express");
const passport = require("passport");
const router = express.Router();

const VenueObject = require("../models/venue");
const ERROR_CODES = require("../utils/errorCodes");
const { capture } = require("../services/sentry");

// ============ PUBLIC ROUTES ============

router.post("/search", async (req, res) => {
  try {
    const { search, city, sort, per_page, page } = req.body;

    let query = {};

    if (search) {
      const searchValue = search.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
      query = {
        ...query,
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { address: { $regex: searchValue, $options: "i" } },
          { city: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    if (city) query.city = { $regex: city, $options: "i" };

    const limit = per_page || 10;
    const offset = page ? (page - 1) * limit : 0;

    const data = await VenueObject.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort || { created_at: -1 });

    const total = await VenueObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await VenueObject.findById(req.params.id);
    if (!data) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

// ============ AUTHENTICATED ROUTES ============

router.post("/my-venues/search", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { search, city, sort, per_page, page } = req.body;

    let query = { owner_id: req.user._id.toString() };

    if (search) {
      const searchValue = search.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
      query = {
        ...query,
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { address: { $regex: searchValue, $options: "i" } },
          { city: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    if (city) query.city = { $regex: city, $options: "i" };

    const limit = per_page || 50;
    const offset = page ? (page - 1) * limit : 0;

    const data = await VenueObject.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort || { created_at: -1 });

    const total = await VenueObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { name, address, city, capacity, amenities, image_url } = req.body;

    if (!name) {
      return res.status(400).send({ ok: false, code: "NAME_REQUIRED" });
    }

    const venue = await VenueObject.create({
      name,
      address,
      city,
      capacity,
      amenities,
      image_url,
      owner_id: req.user._id,
    });

    return res.status(201).send({ ok: true, data: venue });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.put("/:id", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const venue = await VenueObject.findById(req.params.id);
    if (!venue) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    const isOwner = venue.owner_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send({ ok: false, code: "FORBIDDEN" });
    }

    venue.set(req.body);
    await venue.save();

    res.status(200).send({ ok: true, data: venue });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const venue = await VenueObject.findById(req.params.id);
    if (!venue) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    const isOwner = venue.owner_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send({ ok: false, code: "FORBIDDEN" });
    }

    await VenueObject.findByIdAndDelete(req.params.id);

    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

module.exports = router;
