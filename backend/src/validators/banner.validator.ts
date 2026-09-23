import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional();
const optionalUrl = z.string().url("Must be a valid URL").optional();
const optionalDate = z.coerce.date().optional();

const bannerFields = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long").max(200),
  tag: optionalText(50).default("ANNOUNCEMENT"),
  image: optionalUrl,
  shortDescription: optionalText(500),
  registrationUrl: optionalUrl,
  actionText: optionalText(50),
  deadlineText: optionalText(100),
  dateLabel: optionalText(50),
  type: z.enum(["ERROR", "WARNING", "INFO"]).optional().default("INFO"),
  startAt: optionalDate,
  expiresAt: optionalDate,
  venue: optionalText(200),
  isFeatured: z.boolean().optional().default(true),
  status: z.enum(["OPEN", "CLOSING_SOON", "CLOSED"]).optional().default("OPEN"),
  isActive: z.boolean().optional().default(true),
  noticeId: z.string().uuid().optional(),
});

function validateDateRange(data: { startAt?: Date; expiresAt?: Date }, ctx: z.RefinementCtx) {
  if (data.startAt && data.expiresAt && data.expiresAt <= data.startAt) {
    ctx.addIssue({ code: "custom", path: ["expiresAt"], message: "Expiry must be after the start time" });
  }
}

export const createBannerSchema = bannerFields.superRefine(validateDateRange);
export const updateBannerSchema = bannerFields.partial().superRefine(validateDateRange);
