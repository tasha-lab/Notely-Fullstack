"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/avif",
];
const fileFilter = (_req, file, cb) => {
    console.log("Received file:", file.originalname);
    console.log("Detected mimetype:", file.mimetype);
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
};
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const name = Date.now() + "-" + Math.round(Math.random() * 1000) + ext;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 },
});
exports.default = upload;
