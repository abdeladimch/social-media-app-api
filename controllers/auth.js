const User = require("../models/User");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { firstName, lastName, email, password, picturePath } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new BadRequest("Please fill out all fields!");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequest("An account with this email already exist!");
  }
  const user = await User.create(req.body);
  const token = user.genJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      firstName,
      lastName,
      email,
      password: user.password,
      friends: user.friends,
      picturePath,
      userId: user._id,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please fill out all fields!");
  }
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthenticated("Invalid credentials!");
  }
  const token = user.genJWT();
  const formattedUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    picturePath: user.picturePath,
    friends: user.friends,
    userId: user._id,
  };
  res.status(StatusCodes.OK).json({ user: formattedUser, token });
};

module.exports = { register, login };
