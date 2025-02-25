import express from "express";
import { getAllCategories } from "../controllers/getAllCategories.js";

const router = express.Router();

router.get("/", getAllCategories);

export default router;
