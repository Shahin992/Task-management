import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? 'admin@task.local' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@task.local',
      password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!', 10),
      name: 'System Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: process.env.SEED_USER_EMAIL ?? 'user@task.local' },
    update: {},
    create: {
      email: process.env.SEED_USER_EMAIL ?? 'user@task.local',
      password: await bcrypt.hash(process.env.SEED_USER_PASSWORD ?? 'User123!', 10),
      name: 'Normal User',
      role: Role.USER,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
