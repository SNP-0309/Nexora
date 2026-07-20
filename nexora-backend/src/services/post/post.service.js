const Post = require("../../models/Post");
const uploadToCloudinary = require("../../utils/cloudinaryUpload");
const Comment = require("../../models/Comment");

const createPost = async (userId, caption, files) => {
  const uploadedMedia = [];

  for (const file of files) {
    const result = await uploadToCloudinary(
      file,
      "nexora/posts"
    );

    uploadedMedia.push({
      url: result.secure_url,
      type: result.resource_type === "video"
        ? "video"
        : "image",
    });
  }

  const post = await Post.create({
    author: userId,
    caption,
    media: uploadedMedia,
  });

  return post;
};


const toggleLikePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId);

    await post.save();

    return {
      action: "unliked",
      likesCount: post.likes.length,
    };
  }

  post.likes.push(userId);

  await post.save();

  return {
    action: "liked",
    likesCount: post.likes.length,
  };
};



const addComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    author: userId,
    post: postId,
    text,
  });

  post.commentsCount += 1;

  await post.save();

  return comment;
};

const getPostComments = async (postId) => {
  return await Comment.find({ post: postId })
    .populate("author", "username fullName profilePicture")
    .sort({ createdAt: -1 });
};

module.exports = {
  createPost,
  toggleLikePost,
  addComment,
  getPostComments,
};