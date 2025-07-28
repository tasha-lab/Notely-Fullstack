import { Router } from "express";
import {
  createANote,
  deleteNote,
  editNote,
  getAllNotes,
  getASpecificNote,
  getDeletedAllNotes,
  getIndividualUsersNotes,
  getPinnedNotes,
  getPrivateNotes,
  getPublicNotes,
  makeNotePrivate,
  PinNotes,
  restoreDeletedNotes,
} from "../controllers/notes";
import { verify } from "../middlewares/verify";
import { rewriteNote } from "../controllers/rewriteNote";

const router = Router();

router.post("/", verify, createANote);
router.get("/", verify, getAllNotes);
router.get("/user/entries", verify, getIndividualUsersNotes);
router.get("/trash", verify, getDeletedAllNotes);
router.get("/private", verify, getPrivateNotes);
router.get("/pinned", verify, getPinnedNotes);
router.get("/public", verify, getPublicNotes);
router.post("/rewrite", verify, rewriteNote);
router.patch("/pinned/:id", verify, PinNotes);
router.patch("/private/:id", verify, makeNotePrivate);
router.get("/:id", verify, getASpecificNote);
router.delete("/:id", verify, deleteNote);
router.patch("/restore/:id", verify, restoreDeletedNotes);
router.patch("/editNote/:id", verify, editNote);

export default router;
