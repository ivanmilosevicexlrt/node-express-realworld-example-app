import {
  randEmail,
  randFullName,
  randLines,
  randParagraph,
  randPassword,
  randPhrase,
  randWord,
} from '@ngneat/falso';
import { PrismaClient } from '@prisma/client';
import { RegisteredUser } from '../app/routes/auth/registered-user.model';
import { createUser } from '../app/routes/auth/auth.service';
import { addComment, createArticle } from '../app/routes/article/article.service';

const prisma = new PrismaClient();

export const generateUser = async (): Promise<RegisteredUser> =>
  createUser({
    username: randFullName() || 'Default User',
    email: randEmail() || 'default@example.com',
    password: randPassword() || 'defaultpassword',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    demo: true,
  });

export const generateArticle = async (id: number) =>
  createArticle(
    {
      title: `${randPhrase()}-${id}-${Date.now()}`,
      description: randParagraph() || 'Default Description',
      body: randLines({ length: 10 }).join(' ') || 'Default Body',
      tagList: randWord({ length: 4 }).map(w => `${w}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    },
    id,
  );

export const generateComment = async (id: number, slug: string) =>
  addComment(randParagraph() || 'Default Comment', slug, id);

const main = async () => {
  try {
    const users = await Promise.all(Array.from({ length: 12 }, () => generateUser()));

    for await (const user of users) {
      for (let i = 0; i < 12; i++) {
        const article = await generateArticle(user.id);
        for await (const userItem of users) {
          await generateComment(userItem.id, article.slug);
        }
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });