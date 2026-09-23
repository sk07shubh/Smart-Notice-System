import { Router } from "express";
import { createAccount, login, me } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { loginLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate.middleware";
import { createAccountSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/me", authenticate, me);
router.post("/create-account", authenticate, authorize(["ADMIN"]), validate(createAccountSchema), createAccount);

export default router;
