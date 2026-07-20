const express = require("express");

const {
  getCurrentUser,
  getUserByUsername,
} = require("../../controllers/user/user.controller");

const {
  protect,
} = require("../../middlewares/auth/auth.middleware");

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.get("/:username", protect, getUserByUsername);

module.exports = router;