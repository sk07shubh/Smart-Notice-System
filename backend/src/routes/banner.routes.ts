import { Router } from "express";
import * as bannerController from "../controllers/bannerController";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createBannerSchema, updateBannerSchema } from "../validators/banner.validator";

const router = Router();

router.get("/", bannerController.listBanners);
router.post("/", authenticate, authorize(["ADMIN", "FACULTY"]), validate(createBannerSchema), bannerController.addBanner);
router.put("/:id", authenticate, authorize(["ADMIN", "FACULTY"]), validate(updateBannerSchema), bannerController.editBanner);
router.delete("/:id", authenticate, authorize(["ADMIN"]), bannerController.removeBanner);

export default router;
