import multer from "multer";

const MAX_SIZE = (parseInt(process.env.MAX_UPLOAD_SIZE_MB || "5")) * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new Error("Only PDF, JPEG, PNG, or WEBP files are allowed"));
        }
        cb(null, true);
    },
});