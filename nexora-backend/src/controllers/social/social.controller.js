const {
  toggleFollow,
} = require("../../services/social/social.service");

const followUser = async (req, res) => {
  try {
    const result = await toggleFollow(
      req.user._id,
      req.params.userId
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  followUser,
};