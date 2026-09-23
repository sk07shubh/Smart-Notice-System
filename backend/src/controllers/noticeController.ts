import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as noticeService from "../services/noticeService";

export async function listNotices(req: AuthRequest, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const categoryId = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;

  const result = await noticeService.getNotices({ page, limit, categoryId, search });
  res.status(200).json(result);
}

export async function getNotice(req: AuthRequest, res: Response) {
  try {
    const notice = await noticeService.getNoticeById(req.params.id as string);
    res.status(200).json({ data: notice });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function addNotice(req: AuthRequest, res: Response) {
  try {
    const notice = await noticeService.createNotice(req.body, req.user!.userId);
    res.status(201).json({ data: notice });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function editNotice(req: AuthRequest, res: Response) {
  try {
    const notice = await noticeService.updateNotice(req.params.id as string, req.body, req.user!.userId, req.user!.role);
    res.status(200).json({ data: notice });
  } catch (err: any) {
    const status = err.message.includes("Forbidden") ? 403 : err.message.includes("not found") ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
}

export async function removeNotice(req: AuthRequest, res: Response) {
  try {
    await noticeService.deleteNotice(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
