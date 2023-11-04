const multer = require("multer");
const path = require("path");
const fs = require('fs');


//define destination folders
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destinationFolder = path.join(__dirname, '../assets/userImages');
      if(!fs.existsSync(destinationFolder)){
        fs.mkdirSync(destinationFolder, {recursive: true});
      }
      console.log('File destination:', destinationFolder);
      cb(null, destinationFolder);

    },
    
    filename: function(req, file, cb){
        console.log('File uploaded:', file.originalname);
        const name = Date.now()+ '-' +file.originalname;
        cb(null, name)
        console.log("final Image: ", name);
    }
}); 



const upload = multer({storage: storage, limits: {fileSize: 12*1024*1024,}});
module.exports = upload;

