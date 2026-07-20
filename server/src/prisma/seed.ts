import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  // Create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create normal user
  const normalUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: Role.USER,
    },
  });

  // Create project owned by admin
  const project = await prisma.project.create({
    data: {
      name: 'Initial Project',
      description: 'A sample project created by the seed script',
      ownerId: admin.id,
    },
  });

  // Create tasks
  await prisma.task.create({
    data: {
      title: 'Assigned Task',
      description: 'This task is assigned to the regular user',
      status: TaskStatus.IN_PROGRESS,
      projectId: project.id,
      assignedToId: normalUser.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Unassigned Task',
      description: 'This task is not assigned to anyone yet',
      status: TaskStatus.TODO,
      projectId: project.id,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
