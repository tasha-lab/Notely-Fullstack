import { Router } from "express";
import {
  createANote,
  deleteNote,
  editNote,
  getAllNotes,
  getASpecificNote,
  getDeletedAllNotes,
  getIndividualUsersNotes,
  restoreDeletedNotes,
} from "../controllers/notes";
import { verify } from "../middlewares/verify";

const router = Router();

router.post("/", verify, createANote);
router.get("/", verify, getAllNotes);
router.get("/user/entries", verify, getIndividualUsersNotes);
router.get("/trash", verify, getDeletedAllNotes);
router.get("/:id", verify, getASpecificNote);
router.delete("/:id", verify, deleteNote);
router.patch("/restore/:id", verify, restoreDeletedNotes);
router.patch("/editNote/:id", verify, editNote);

export default router;
