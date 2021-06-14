const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      console.log("hello");
      cb(null, path.resolve('uploads/'));
   },
   filename: (req, file, cb) => {
      console.log("world");
      cb(null, file.fieldname + "-" + file.originalname);
   }
});   
   
const upload = multer({storage: storage});

module.exports = upload;