const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Unauthenticated } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("bearer ")) {
    throw new Unauthenticated("Authentication failed!");
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { userId: decoded.userId };
  next();
};

module.exports = authMiddleware;
