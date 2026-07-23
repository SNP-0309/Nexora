const { createPost } = require("../../services/post/post.service");
const { toggleLikePost } = require("../../services/post/post.service");

const {
  addComment,
  getPostComments,
  getFeed,
} = require("../../services/post/post.service");
const createNewPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one file",
      });
    }

    const post = await createPost(
      req.user._id,
      caption,
      files
    );

    return res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const likePost = async (req, res) => {
  try {
    const result = await toggleLikePost(
      req.params.postId,
      req.user._id
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
const createComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await addComment(
      req.params.postId,
      req.user._id,
      text
    );

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchComments = async (req, res) => {
  try {
    const comments = await getPostComments(
      req.params.postId
    );

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getFeedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await getFeed(page, limit);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createNewPost,
  likePost,
  createComment,
  fetchComments,
  getFeedPosts,
};