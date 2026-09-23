import { Router } from "express";
import { listCategories, addCategory } from "../controllers/categoryController";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCategorySchema } from "../validators/notice.validator";

const router = Router();

router.get("/", listCategories);
router.post("/", authenticate, authorize(["ADMIN"]), validate(createCategorySchema), addCategory);

export default router;
