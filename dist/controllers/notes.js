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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicNotes = exports.getPinnedNotes = exports.PinNotes = exports.getPrivateNotes = exports.makeNotePrivate = exports.restoreDeletedNotes = exports.getDeletedAllNotes = exports.deleteNote = exports.getASpecificNote = exports.editNote = exports.getIndividualUsersNotes = exports.getAllNotes = exports.createANote = void 0;
const prismaClient_1 = __importDefault(require("../Config/prismaClient"));
const createANote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { title, synopsis, content, isPrivate } = req.body;
        if (!creatorId) {
            res.status(400).json({
                message: "Cant create note, please login first",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.create({
            data: { title, synopsis, content, userId: creatorId, isPrivate },
        });
        res.status(200).json({
            message: "Note added successfully",
            data: note,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.createANote = createANote;
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        if (!creatorId) {
            res.status(400).json({
                message: "Can't get notes,please login",
            });
            return;
        }
        const notes = yield prismaClient_1.default.notes.findMany({
            orderBy: { dateCreated: "desc" },
            where: {
                isDeleted: false,
                isPrivate: false,
            },
        });
        res.status(200).json({
            message: "Notes gotten successfully",
            data: notes,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getAllNotes = getAllNotes;
const getIndividualUsersNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createrId = req.userId;
        if (!createrId) {
            res.status(401).json({ message: `Can't get posts.Please login!` });
            return;
        }
        const notes = yield prismaClient_1.default.notes.findMany({
            where: {
                userId: createrId,
                isDeleted: false,
            },
            orderBy: { dateCreated: "desc" },
        });
        res.status(201).json({
            message: "All your notes gotten successfully",
            data: notes,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getIndividualUsersNotes = getIndividualUsersNotes;
const editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        if (!creatorId) {
            res.status(400).json({
                message: "Can't edit note,please login",
            });
            console.log(creatorId);
            return;
        }
        const { title, synopsis, content } = req.body;
        const { id } = req.params;
        const note = yield prismaClient_1.default.notes.findUnique({
            where: { id },
        });
        if ((note === null || note === void 0 ? void 0 : note.userId) !== creatorId) {
            res.status(300).json({
                message: `You cannot edit another author's post`,
            });
        }
        const editNote = yield prismaClient_1.default.notes.update({
            where: { id },
            data: { title, synopsis, content },
        });
        res.status(200).json({
            message: "Post has been updated successfully",
            data: editNote,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.editNote = editNote;
const getASpecificNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { id } = req.params;
        if (!creatorId) {
            res.status(200).json({
                message: "Can't get note,please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findFirst({
            where: { id },
            include: {
                user: {
                    select: {
                        avatar: true,
                        firstname: true,
                        lastname: true,
                    },
                },
            },
        });
        if (note) {
            res.status(200).json({
                message: "Note gotten successfully",
                data: note,
            });
            return;
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getASpecificNote = getASpecificNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { id } = req.params;
        if (!creatorId) {
            res.status(400).json({
                message: "Cant delete note, please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findUnique({
            where: { id },
        });
        if ((note === null || note === void 0 ? void 0 : note.userId) !== creatorId) {
            res.status(400).json({
                message: "Cant edit another authors posts",
            });
            return;
        }
        yield prismaClient_1.default.notes.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
        res.status(200).json({
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.deleteNote = deleteNote;
const getDeletedAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        if (!creatorId) {
            res.status(200).json({
                message: "Cant get deleted notes,please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findMany({
            where: { isDeleted: true, userId: creatorId },
            orderBy: { dateCreated: "desc" },
        });
        res.status(200).json({
            message: "Deleted notes retrieved successfully",
            data: note,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getDeletedAllNotes = getDeletedAllNotes;
const restoreDeletedNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { id } = req.params;
        if (!creatorId) {
            res.status(400).json({
                message: "Cant restore note,please login",
            });
            return;
        }
        yield prismaClient_1.default.notes.updateMany({
            where: { id },
            data: {
                isDeleted: false,
            },
        });
        res.status(200).json({
            message: "Note restored successfully",
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.restoreDeletedNotes = restoreDeletedNotes;
const makeNotePrivate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { id } = req.params;
        if (!creatorId) {
            res.status(400).json({
                message: "Cant make note private, please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findUnique({
            where: { id },
        });
        if ((note === null || note === void 0 ? void 0 : note.userId) !== creatorId) {
            res.status(400).json({
                message: "Cant set another authors posts to private",
            });
            return;
        }
        yield prismaClient_1.default.notes.update({
            where: { id },
            data: {
                isPrivate: !note.isPrivate,
            },
        });
        res.status(200).json({
            message: !note.isPrivate ? "Set to Private" : "Set to Public",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.makeNotePrivate = makeNotePrivate;
const getPrivateNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        if (!creatorId) {
            res.status(200).json({
                message: "Cant get Private notes,please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findMany({
            where: {
                isPrivate: true,
                isDeleted: false,
                userId: creatorId,
            },
            orderBy: { dateCreated: "desc" },
        });
        res.status(200).json({
            message: "Private notes retrieved successfully",
            data: note,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getPrivateNotes = getPrivateNotes;
const PinNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        const { id } = req.params;
        if (!creatorId) {
            res.status(400).json({
                message: "Cant Pin note, please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findUnique({
            where: { id },
        });
        if ((note === null || note === void 0 ? void 0 : note.userId) !== creatorId) {
            res.status(400).json({
                message: "Cant Pin another authors posts",
            });
            return;
        }
        yield prismaClient_1.default.notes.update({
            where: { id },
            data: {
                isPinned: !note.isPinned,
            },
        });
        res.status(200).json({
            message: !note.isPinned ? "Note pinned" : "Note Unpinned",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.PinNotes = PinNotes;
const getPinnedNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        if (!creatorId) {
            res.status(200).json({
                message: "Cant get Pinned notes,please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findMany({
            where: { isPinned: true, isDeleted: false, userId: creatorId },
            orderBy: { dateCreated: "desc" },
        });
        res.status(200).json({
            message: "Pinned notes retrieved successfully",
            data: note,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getPinnedNotes = getPinnedNotes;
const getPublicNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorId = req.userId;
        if (!creatorId) {
            res.status(200).json({
                message: "Cant get Public notes,please login",
            });
            return;
        }
        const note = yield prismaClient_1.default.notes.findMany({
            where: {
                isPrivate: false,
                isDeleted: false,
                userId: creatorId,
            },
            orderBy: { dateCreated: "desc" },
        });
        res.status(200).json({
            message: "Public notes retrieved successfully",
            data: note,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
        console.log(error);
        return;
    }
});
exports.getPublicNotes = getPublicNotes;
