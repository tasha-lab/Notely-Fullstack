"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPassword = exports.EditPrimaryDetails = exports.getUserDetails = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../Config/prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const imageKit_1 = __importDefault(require("../Config/imageKit"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        if (!(firstname === null || firstname === void 0 ? void 0 : firstname.trim()) ||
            !(lastname === null || lastname === void 0 ? void 0 : lastname.trim()) ||
            !(username === null || username === void 0 ? void 0 : username.trim()) ||
            !(email === null || email === void 0 ? void 0 : email.trim()) ||
            !(password === null || password === void 0 ? void 0 : password.trim())) {
            res.status(400).json({
                message: "All fields must be filled correctly",
            });
            return;
        }
        const existingUser = yield prismaClient_1.default.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            res.status(409).json({
                message: "user already exists, Please login",
            });
            return;
        }
        const hashpassword = yield bcryptjs_1.default.hash(password, 10);
        yield prismaClient_1.default.user.create({
            data: { firstname, lastname, username, email, password: hashpassword },
        });
        res.status(201).json({
            message: "User created successfully",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = yield prismaClient_1.default.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });
        if (!user) {
            res.status(200).json({
                message: "Invalid login details",
            });
            return;
        }
        const correctPassword = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!correctPassword) {
            res.status(400).json({
                message: "Incorrect password",
            });
            return;
        }
        const { userId, password: _, dateJoined, isDeleted, lastUpdated } = user, rest = __rest(user, ["userId", "password", "dateJoined", "isDeleted", "lastUpdated"]);
        const token = jsonwebtoken_1.default.sign({ userId: user.userId, firstname: user.firstname }, process.env.JWT_SECRET, {
            expiresIn: "48h",
        });
        res.status(200).json({ message: "Login Successfully", token, user: rest });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
});
exports.loginUser = loginUser;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.userId;
        if (!id) {
            res.status(401).json({
                message: "Cant edit details,please login",
            });
            return;
        }
        const user = yield prismaClient_1.default.user.findFirst({
            where: { userId: id },
        });
        res.status(200).json({
            message: "Details gotten successfully",
            user,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
        return;
    }
});
exports.getUserDetails = getUserDetails;
const EditPrimaryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.userId;
        if (!id) {
            res.status(401).json({
                message: "Cant edit details,please login",
            });
            return;
        }
        const { firstname, lastname, email, username } = req.body;
        const imageFile = req.file;
        let imageURL;
        if (imageFile) {
            const fileBuffer = fs_1.default.readFileSync(imageFile.path);
            const response = yield imageKit_1.default.upload({
                file: fileBuffer,
                fileName: `tasha/${Date.now()}`,
                folder: "/user",
            });
            fs_1.default.unlinkSync(imageFile.path);
            imageURL = imageKit_1.default.url({
                path: response.filePath,
                transformation: [
                    { width: "1280" },
                    { quality: "auto" },
                    { format: "webp" },
                ],
            });
        }
        const details = yield prismaClient_1.default.user.update({
            where: { userId: id },
            data: Object.assign({ firstname,
                lastname,
                email,
                username }, (imageURL && { avatar: imageURL })),
        });
        res.status(200).json({
            message: "Details edited successfully",
            data: details,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
});
exports.EditPrimaryDetails = EditPrimaryDetails;
const EditPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { oldPassword, newPassword } = req.body;
        if (oldPassword === newPassword) {
            res.status(401).json({
                message: "Please enter a new password to edit password",
            });
            return;
        }
        if (!creatorId) {
            res.status(200).json({
                message: "please login",
            });
            return;
        }
        const user = yield prismaClient_1.default.user.findFirst({
            where: { userId: creatorId },
        });
        if (!user) {
            res.status(404).json({
                message: "user not found",
            });
            return;
        }
        const passwordsMatch = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
        if (!passwordsMatch) {
            res.status(400).json({
                message: "Your old passwords dont match",
            });
            return;
        }
        const hashpassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prismaClient_1.default.user.update({
            where: { userId: creatorId },
            data: {
                password: hashpassword,
            },
        });
        res.status(200).json({
            message: "Password updated successfully",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
});
exports.EditPassword = EditPassword;
// export const EditProfileImage = async (req: UsersRequest, res: Response) => {
//   try {
//     const creatorId = req.userId;
//     await client.user.update({
//       where: { userId: creatorId },
//       data: {
//         avatar: imageURL,
//       },
//     });
//     res.status(200).json({
//       message: "Profile image added successfully",
//     });
//     return;
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "something went wrong" });
//     return;
//   }
// };
