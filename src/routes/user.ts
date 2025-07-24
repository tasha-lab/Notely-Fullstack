import { Router } from "express";
import {
  createUser,
  EditPassword,
  EditPrimaryDetails,
  getUserDetails,
  loginUser,
} from "../controllers/users";
import { verify } from "../middlewares/verify";
import upload from "../middlewares/multer";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/userdetails", verify, getUserDetails);
router.patch("/user", upload.single("avatar"), verify, EditPrimaryDetails);
router.patch("/password", verify, EditPassword);

export default router;
