import prisma from "../config/db";

export async function upsertSubscriber(email: string) {
  return prisma.subscriber.upsert({
    where: { email },
    update: {}, // Already subscribed, do nothing
    create: { email },
  });
}
