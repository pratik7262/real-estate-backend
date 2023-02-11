const multer = require("multer");
require('dotenv').config();
const {GridFsStorage} = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: "mongodb+srv://realEstate:MHf40SCQRQE4DoVC@cluster0.3tphinl.mongodb.net/realEstate?retryWrites=true&w=majority",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-any-name-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-any-name-${file.originalname}`,
    };
  },
});

module.exports = multer({ storage });
