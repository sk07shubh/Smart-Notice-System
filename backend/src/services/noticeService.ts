import prisma from "../config/db";
import { sendNoticeNotification } from "../utils/mailer";
import { deleteStoredAttachment } from "./uploadService";

interface GetNoticesParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export async function getNotices({ page = 1, limit = 10, categoryId, search }: GetNoticesParams) {
  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      include: { category: true, attachments: true, postedBy: { select: { name: true } } },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notice.count({ where }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getNoticeById(id: string) {
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { category: true, attachments: true, postedBy: { select: { name: true } } },
  });
  if (!notice) throw new Error("Notice not found");
  return notice;
}

export async function createNotice(data: any, postedById: string) {
  const { attachmentIds, ...noticeData } = data;
  const notice = await prisma.notice.create({
    data: {
      ...noticeData,
      postedById,
      attachments: attachmentIds?.length ? { connect: attachmentIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { category: true, attachments: true },
  });

  // Fire and forget email notification
  sendNoticeNotification(notice).catch(console.error);

  return notice;
}

export async function updateNotice(id: string, data: any, userId: string, userRole: string) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new Error("Notice not found");
  if (userRole !== "ADMIN" && existing.postedById !== userId) {
    throw new Error("Forbidden: you can only edit your own notices");
  }

  const { attachmentIds, ...noticeData } = data;
  return prisma.notice.update({
    where: { id },
    data: {
      ...noticeData,
      attachments: attachmentIds === undefined ? undefined : { set: attachmentIds.map((aid: string) => ({ id: aid })) },
    },
    include: { category: true, attachments: true },
  });
}

export async function deleteNotice(id: string) {
  const existing = await prisma.notice.findUnique({ where: { id }, include: { attachments: true } });
  if (!existing) throw new Error("Notice not found");
  await Promise.all(existing.attachments.map(deleteStoredAttachment));
  await prisma.$transaction([
    prisma.attachment.deleteMany({ where: { noticeId: id } }),
    prisma.notice.delete({ where: { id } }),
  ]);
}
