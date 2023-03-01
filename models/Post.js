const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: [200],
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: [String],
      default: [],
    },
    postPicturePath: String,
    userPicturePath: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
