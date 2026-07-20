const User = require("../../models/User");

const toggleFollow = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return {
      action: "unfollowed",
    };
  }

  currentUser.following.push(targetUserId);
  targetUser.followers.push(currentUserId);

  await currentUser.save();
  await targetUser.save();

  return {
    action: "followed",
  };
};

module.exports = {
  toggleFollow,
};