const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure folder exists
const uploadDir = path.join(__dirname, "..", "uploads", "communities");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      "community-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const uploadCommunityCover = multer({
  storage,
  fileFilter,
});

module.exports = uploadCommunityCover;
