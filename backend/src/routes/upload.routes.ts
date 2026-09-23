import { Router } from "express";
import { handleUpload, handleDelete } from "../controllers/uploadController";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/", authenticate, authorize(["ADMIN", "FACULTY"]), upload.single("file"), handleUpload);
router.delete("/:id", authenticate, authorize(["ADMIN", "FACULTY"]), handleDelete);

export default router;