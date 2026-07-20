const express = require("express");

const {
  followUser,
} = require("../../controllers/social/social.controller");

const {
  protect,
} = require("../../middlewares/auth/auth.middleware");

const router = express.Router();

router.post("/follow/:userId", protect, followUser);

module.exports = router;