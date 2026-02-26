import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid conflicts
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // Seed a known test user
  await prisma.user.create({
    data: {
      username: 'RealWorld',
      email: 'realworld@me',
      password: await bcrypt.hash('password123', 10),
      bio: null,
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
