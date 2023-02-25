const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");

const imagePath = path.join(__dirname, "../public/images");
// that's how u set the directiry to store ur files
// since well be using this functionality in register well import it from utils we dont need to set it inapp.js

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + "--" + file.originalname);
  },
});
const upload = multer({ storage: storageEngine });

module.exports = upload;
