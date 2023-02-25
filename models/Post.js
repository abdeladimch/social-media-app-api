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
      required: true,
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

// we did add firstName and lastName cuz the post will have user credentials
// we did set the likes as map of booleans cuz it would be efficient to see who liked which post
// we set the picture as pat cuz we need to get that path in order to have access to the actual file
module.exports = mongoose.model("Post", PostSchema);
