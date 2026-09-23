import { Router } from "express";
import { subscribe } from "../controllers/subscriberController";
import { validate } from "../middleware/validate.middleware";
import { subscribeSchema } from "../validators/subscriber.validator";

const router = Router();

router.post("/", validate(subscribeSchema), subscribe);

export default router;
