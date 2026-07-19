const express = require("express");
const {
  protect,
} = require("../../middlewares/auth/auth.middleware");

const {
  register,
  login,
  logout,
  refreshToken,
} = require("../../controllers/auth/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);






router.post("/logout", protect, logout);
module.exports = router;