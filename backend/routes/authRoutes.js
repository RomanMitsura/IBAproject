import { Router } from "express";
import {
  authRegister,
  authLogin,
  checkAuth,
} from "../controllers/authController.js";
import { registerValidation, loginValidation } from "../validation/auth.js";

const router = new Router();

router.post("/register", registerValidation, authRegister);
router.post("/login", loginValidation, authLogin);
router.get("/me", checkAuth);

export default router;
