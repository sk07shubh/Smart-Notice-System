import prisma from "../config/db";

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(name: string) {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) throw new Error("Category already exists");
  return prisma.category.create({ data: { name } });
}
