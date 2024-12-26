import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const reviews = Array.from({ length: 20 }, (_, i) => ({
    title: `Review ${i + 1}`,
    content: `This is the content for review ${i + 1}.`,
    rating: Math.floor(Math.random() * 5) + 1,
    author: `Author ${Math.ceil((i + 1) / 5)}`,
    createdAt: new Date().toISOString(),
  }));

  await prisma.review.createMany({ data: reviews });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
