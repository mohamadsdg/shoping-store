const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "images/png" ||
    file.mimetype == "images/jpg" ||
    file.mimetype == "images/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.Upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
