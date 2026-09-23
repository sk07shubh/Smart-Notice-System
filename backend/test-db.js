const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.subscriber.findMany().then(subs => {
    console.log("Subscribers:", subs);
}).finally(() => prisma.$disconnect());
