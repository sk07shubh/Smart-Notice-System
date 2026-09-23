import { Router } from "express";
import * as noticeController from "../controllers/noticeController";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createNoticeSchema, updateNoticeSchema } from "../validators/notice.validator";

const router = Router();

router.get("/", noticeController.listNotices);
router.get("/:id", noticeController.getNotice);
router.post("/", authenticate, authorize(["ADMIN", "FACULTY"]), validate(createNoticeSchema), noticeController.addNotice);
router.put("/:id", authenticate, authorize(["ADMIN", "FACULTY"]), validate(updateNoticeSchema), noticeController.editNotice);
router.delete("/:id", authenticate, authorize(["ADMIN"]), noticeController.removeNotice);

export default router;
