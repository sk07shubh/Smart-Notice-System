import { Request, Response } from "express";
import { getAllCategories, createCategory } from "../services/categoryService";

export async function listCategories(req: Request, res: Response) {
  const categories = await getAllCategories();
  res.status(200).json({ data: categories });
}

export async function addCategory(req: Request, res: Response) {
  try {
    const category = await createCategory(req.body.name);
    res.status(201).json({ data: category });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
