import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  categoryId: z.string().uuid(),
  isPinned: z.boolean().optional().default(false),
  attachmentIds: z.array(z.string().uuid()).optional().default([]),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
});
