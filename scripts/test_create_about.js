import { prisma } from '../lib/prisma';

async function run() {
  try {
    const res = await prisma.about.create({
      data: { userId: '00000000-0000-0000-0000-000000000000' },
    });
    console.log('created', res);
  } catch (err) {
    console.error('error creating about:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
