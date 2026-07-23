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
const getFeed = async (page = 1, limit = 10) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const totalPosts = await Post.countDocuments({
    isDeleted: false,
    visibility: "public",
  });

  const posts = await Post.find({
    isDeleted: false,
    visibility: "public",
  })
    .populate(
      "author",
      "username fullName profilePicture"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
  };
};
module.exports = {
  createPost,
  toggleLikePost,
  addComment,
  getPostComments,
  getFeed,
};