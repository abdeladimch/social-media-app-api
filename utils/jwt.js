const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (user) => {
  return { userId: user._id, email: user.email };
};

const genJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  // we'll use it in authMiddleware
  // we'l set role permission like authorizationt and stuff
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToRes = (res, userToken, refreshToken) => {
  const accessTokenJWT = genJWT(userToken);
  const refreshTokenJWT = genJWT({ userToken, refreshToken });

  res.cookie("accessToken", accessTokenJWT, {
    expires: new Date(Date.now() + 1000 * 60 * 15),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    signed: true,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    expires: new Date(Date.now() + 1000 * 3600 * 24 * 30),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    signed: true,
  });
};

module.exports = { createToken, genJWT, verifyToken, attachCookiesToRes };
