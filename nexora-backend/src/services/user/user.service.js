const User = require("../../models/User");

const getUserProfile = async (username) => {
  const user = await User.findOne({ username })
    .select("-password -refreshToken")
    .populate("followers", "username fullName profilePicture")
    .populate("following", "username fullName profilePicture");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  getUserProfile,
};