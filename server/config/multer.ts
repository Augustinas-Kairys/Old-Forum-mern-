import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now().toString() + path.extname(file.originalname); // Append original file extension
    cb(null, uniqueFileName); // Use the timestamp with original file extension as the filename
  },
});

const upload = multer({ storage });

export default upload;
