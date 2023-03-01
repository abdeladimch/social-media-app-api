const Post = require("../models/Post");
const User = require("../models/User");
const { NotFound, BadRequest } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createPost = async (req, res) => {
  const { userId } = req.params;
  const { description, postPicturePath } = req.body;
  const user = await User.findOne({ _id: userId });
  const post = await Post.create({
    user: userId,
    firstName: user.firstName,
    lastName: user.lastName,
    description,
    postPicturePath,
    userPicturePath: user.picturePath,
    likes: {},
    comments: [],
  });
  const posts = await Post.find();
  res.status(StatusCodes.CREATED).json({ posts });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  if (!posts) {
    throw new NotFound("No posts for the moment!");
  }
  res.status(StatusCodes.OK).json({ posts });
};

const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ _id: userId });
  if (!posts) {
    throw new NotFound("No posts for the moment!");
  }
  res.status(StatusCodes.OK).json({ posts });
};

const likePost = async (res, req) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findOne({ _id: id });
  const isLiked = post.likes.get(userId);
  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: id },
    { likes: post.likes },
    { new: true }
  );
  res.status(StatusCodes.OK).json({ post: updatedPost });
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
};
