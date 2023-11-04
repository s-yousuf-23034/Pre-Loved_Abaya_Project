const multer = require("multer");
const path = require("path");
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationFolder = path.join(__dirname, '../assets/productImages');
    if(!fs.existsSync(destinationFolder)){
        fs.mkdirSync(destinationFolder, {recursive: true});
      }
      console.log('File destination:', destinationFolder);
      cb(null, destinationFolder);

    },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded image
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
    console.log("final Image: ", name);
  },
});
const maxImageCount = 3;
const upload = multer({
  storage: storage,
  limits: { fileSize: 12 * 1024 * 1024, files: maxImageCount  }, // Limit file size to 12MB
});

module.exports = upload;
