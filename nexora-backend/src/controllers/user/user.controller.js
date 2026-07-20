const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};


const {
  getUserProfile,
} = require("../../services/user/user.service");

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await getUserProfile(username);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCurrentUser,
  getUserByUsername,
}