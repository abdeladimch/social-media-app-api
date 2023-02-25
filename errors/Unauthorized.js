const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class Unauthorized extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = Unauthorized;
