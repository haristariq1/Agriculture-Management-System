const multer = require('multer'); const path = require('path'); const crypto = require('crypto');
const storage = multer.diskStorage({ destination: path.join(__dirname, '../public/Images'), filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`) });
const upload = multer({ storage, limits: { fileSize: 1024 * 1024, files: 1 }, fileFilter: (_req, file, cb) => ['image/jpeg', 'image/png'].includes(file.mimetype) ? cb(null, true) : cb(Object.assign(new Error('Only JPG or PNG images are allowed'), { status: 400 })) });
module.exports = upload;
