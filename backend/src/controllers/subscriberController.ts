import { Request, Response } from "express";
import { upsertSubscriber } from "../services/subscriberService";

export async function subscribe(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await upsertSubscriber(email);
    res.status(200).json({ message: "Successfully subscribed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
