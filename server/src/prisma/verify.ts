import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  const projects = await prisma.project.findMany({ include: { owner: true } });
  const tasks = await prisma.task.findMany({ include: { project: true, assignedTo: true } });

  console.log('--- Verification ---');
  console.log(`Users: ${users.length} (Expected: 2)`);
  console.log(`Projects: ${projects.length} (Expected: 1)`);
  console.log(`Tasks: ${tasks.length} (Expected: 2)`);
  
  const admin = users.find(u => u.role === 'ADMIN');
  const normalUser = users.find(u => u.role === 'USER');
  
  if (admin) console.log(`Admin exists: ${admin.email}`);
  if (normalUser) console.log(`Normal User exists: ${normalUser.email}`);
  
  if (projects.length > 0) {
    console.log(`Project Owner: ${projects[0].owner.name}`);
  }
  
  for (const task of tasks) {
    console.log(`Task: ${task.title}, Status: ${task.status}, Assigned To: ${task.assignedTo?.name || 'Unassigned'}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
