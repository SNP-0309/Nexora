const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const generateAccessToken = require("../../utils/generateAccessToken");
const generateRefreshToken = require("../../utils/generateRefreshToken");

const registerUser = async (userData) => {
  const { username, fullName, email, password } = userData;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;

  await user.save();

  return {
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};
const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;

  await user.save();

  return {
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};
const logoutUser = async (userId) => {
  const user = await User.findById(userId).select(
    "+refreshToken"
  );

  if (!user) {
    throw new Error("User not found");
  }

  user.refreshToken = null;

  await user.save();

  return true;
};


const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.userId).select(
    "+refreshToken"
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);

  return {
    accessToken,
  };
};
module.exports = {
  registerUser,
  loginUser,
    logoutUser,
    refreshAccessToken,
};