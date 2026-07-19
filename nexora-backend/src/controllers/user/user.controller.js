const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = {
  getCurrentUser,
};
