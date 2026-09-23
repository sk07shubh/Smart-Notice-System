import { Request, Response } from "express";
import { createAccountForAdmin, loginUser } from "../services/authService";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

export async function createAccount(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    const user = await createAccountForAdmin(name, email, password, role);
    res.status(201).json({ data: user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(200).json({ data: user });
}
