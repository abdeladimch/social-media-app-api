// to do!
const { verifyToken, attachCookiesToRes } = require("../utils/jwt");
const { Unauthenticated } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (!accessToken && !refreshToken) {
    throw new Unauthenticated("Unauthenticated!");
  }

  if (accessToken) {
    req.user = verifyToken(accessToken);
    return next();
  }
  const decoded = verifyToken(refreshToken);
  req.user = decoded.userToken;
  attachCookiesToRes(res, decoded.userToken, decoded.refreshToken);
  next();
};

module.exports = authMiddleware;
