import { Router } from "express";
import {
  createANote,
  deleteNote,
  getAllNotes,
  getASpecificNote,
  getDeltedAllNotes,
  restoreDeletedNotes,
} from "../controllers/notes";
import { verify } from "../middlewares/verify";

const router = Router();

router.post("/", verify, createANote);
router.get("/", verify, getAllNotes);
router.get("/trash", verify, getDeltedAllNotes);
router.get("/:id", verify, getASpecificNote);
router.delete("/:id", verify, deleteNote);
router.patch("/restore/:id", verify, restoreDeletedNotes);

export default router;
