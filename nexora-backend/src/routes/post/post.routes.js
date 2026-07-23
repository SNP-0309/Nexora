const express = require("express");

const {
  createNewPost,
  likePost,
  createComment,
  fetchComments,
  getFeedPosts,
} = require("../../controllers/post/post.controller");

const {
  protect,
} = require("../../middlewares/auth/auth.middleware");

const upload = require("../../middlewares/uploads/upload.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("media", 10),
  createNewPost
);
router.post(
  "/:postId/comment",
  protect,
  createComment
);

router.get(
  "/:postId/comments",
  protect,
  fetchComments
);

router.post("/:postId/like", protect, likePost);
router.get("/feed", protect, getFeedPosts);

module.exports = router;