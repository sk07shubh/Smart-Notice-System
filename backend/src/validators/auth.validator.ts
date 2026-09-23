import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createAccountSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["ADMIN", "FACULTY"], {
    error: "Role must be either ADMIN or FACULTY; STUDENT accounts are not supported",
  }),
});
