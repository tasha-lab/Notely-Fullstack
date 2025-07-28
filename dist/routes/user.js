"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const verify_1 = require("../middlewares/verify");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.post("/register", users_1.createUser);
router.post("/login", users_1.loginUser);
router.get("/userdetails", verify_1.verify, users_1.getUserDetails);
router.patch("/user", multer_1.default.single("avatar"), verify_1.verify, users_1.EditPrimaryDetails);
router.patch("/password", verify_1.verify, users_1.EditPassword);
exports.default = router;
