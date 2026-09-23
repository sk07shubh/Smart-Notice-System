import { Request, Response } from "express";
import * as bannerService from "../services/bannerService";

export async function listBanners(_req: Request, res: Response) {
  const banners = await bannerService.getActiveBanners();
  res.status(200).json({ data: banners });
}

export async function addBanner(req: Request, res: Response) {
  try {
    const banner = await bannerService.createBanner(req.body);
    res.status(201).json({ data: banner });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function editBanner(req: Request, res: Response) {
  try {
    const banner = await bannerService.updateBanner(req.params.id as string, req.body);
    res.status(200).json({ data: banner });
  } catch (err: any) {
    const status = err.message.includes("not found") ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
}

export async function removeBanner(req: Request, res: Response) {
  try {
    await bannerService.deleteBanner(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
