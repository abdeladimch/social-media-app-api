const User = require("../models/User");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated } = require("../errors");
const Token = require("../models/Token");
const crypto = require("crypto");
const { createToken, attachCookiesToRes } = require("../utils/jwt");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new BadRequest("Please fill out all fields!");
  }
  const existingUser = await User.findOne({ email }).select("-password");
  if (existingUser) {
    throw new BadRequest("An account with this email already exist!");
  }
  const user = await User.create(req.body);
  return res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please fill out all fields!");
  }
  const user = await User.findOne({ email }).select("-password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthenticated("Invalid credentials!");
  }

  const userToken = createToken(user);

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    refreshToken = existingToken.refreshToken;
    attachCookiesToRes(res, userToken, refreshToken);
    return res.status(StatusCodes.OK).json({ user: userToken });
  }
  refreshToken = await crypto.randomBytes(64).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const token = await Token.create({
    userAgent,
    ip,
    user: user._id,
    refreshToken,
  });
  attachCookiesToRes(res, userToken, refreshToken);
  // we have to send the user back to the frontend to access friends and other properties
  res.status(StatusCodes.OK).json(user);
};

const logout = async (req, res) => {
  const { userId } = req.user;
  await Token.findOneAndDelete({ user: userId });
  res.cookie("accessToken", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.cookie("refreshToken", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};
module.exports = { register, login, logout };
