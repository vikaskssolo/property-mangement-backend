import multer from "multer";

const storage = multer.memoryStorage({
  destination: "./public/products",
  filename: (req, file, cb) => {
    const uniqueName = new Date().getTime();
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, uniqueName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("png") ||
    file.mimetype.includes("mp4")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Invalid File type"));
  }
};

const maxSize = 1024 * 1024 * 5;

const uploads = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});

export default uploads;
