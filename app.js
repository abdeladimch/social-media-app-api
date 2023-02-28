require("dotenv").config();
require("express-async-errors");
const morgan = require("morgan");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 6000;
const cookieParser = require("cookie-parser");

//routers import
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");

// middleware import
const connectDB = require("./db/connectDB");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

// security packages import
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

mongoose.set("strictQuery", true);

app.use(
  rateLimiter({
    windowMs: 50,
    maxAge: 1000 * 60 * 15,
  })
);
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));

connectDB(process.env.MONGO_URI);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.use(errorHandler);
app.use(notFound);

mongoose.connection.once("open", () => {
  console.log("Connected to DB!");
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
});
