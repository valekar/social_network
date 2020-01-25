const path = require("path");
const cryptos = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const mongoURI = process.env.MONGO_URL;

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req: any, file: any) => {
    return new Promise((resolve, reject) => {
      cryptos.randomBytes(16, (err: any, buf: any) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

export default upload;
