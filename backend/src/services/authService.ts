import prisma from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";

export async function createAccountForAdmin(
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "FACULTY"
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user: { id: user.id, name: user.name, role: user.role } };
}
