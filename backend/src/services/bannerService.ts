import prisma from "../config/db";

export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    include: { notice: { select: { id: true, title: true } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function createBanner(data: any) {
  return prisma.banner.create({
    data,
    include: { notice: { select: { id: true, title: true } } },
  });
}

export async function updateBanner(id: string, data: any) {
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new Error("Banner not found");

  return prisma.banner.update({
    where: { id },
    data,
    include: { notice: { select: { id: true, title: true } } },
  });
}

export async function deleteBanner(id: string) {
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new Error("Banner not found");
  await prisma.banner.delete({ where: { id } });
}
