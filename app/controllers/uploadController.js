const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/issueAttachments");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

exports.upload = multer({ storage: storage }).array("attachments", 10);
