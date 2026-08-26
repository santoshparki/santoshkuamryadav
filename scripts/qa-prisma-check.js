(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const latest = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    console.log(JSON.stringify({ success: true, latest }, null, 2));
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error(JSON.stringify({ success: false, error: String(err) }, null, 2));
    process.exit(2);
  }
})();
