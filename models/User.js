const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    maxlength: [20, "First name cannot be more than 50 characters long!"],
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [20, "Last name cannot be more than 50 characters long!"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email!"],
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address!",
    ],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "Password cannot be less than 8 characters long!"],
  },
  picturePath: {
    type: String,
    default: "",
  },
  friends: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
