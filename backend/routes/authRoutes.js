import { Router } from "express";
import {
  authRegister,
  authLogin,
  checkAuth,
} from "../controllers/authController.js";
import { registerValidation } from "../validation/atuh.js";

const router = new Router();

router.post("/register", registerValidation, authRegister);
router.post("/login", authLogin);
router.get("/me", checkAuth);

export default router;
