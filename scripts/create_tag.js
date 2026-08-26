import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    let about = await prisma.about.findFirst();
    if (!about) {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({ data: { email: 'admin@example.com', fullName: 'Site Admin' } });
        console.log('created user', user.id);
      }
      about = await prisma.about.create({ data: { userId: user.id } });
      console.log('created about', about.id);
    }

    const tag = await prisma.aboutTag.create({ data: { aboutId: about.id, label: 'Test Tag', displayOrder: 0, isActive: true } });
    console.log('created tag', tag.id);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
