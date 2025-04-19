import { PrismaClient } from "@prisma/client";
import { recalculateRanks } from "./utils/recalculate";

const prisma = new PrismaClient();

async function main() {
  const users = ["Alice", "Bob", "Charlie", "David", "Eva"];

  for (const name of users) {
    const user = await prisma.user.create({
      data: { fullName: name },
    });

    const activities = Array.from(
      { length: Math.floor(Math.random() * 10) + 1 },
      () => ({
        userId: user.id,
        points: 20,
        createdAt: new Date(),
      })
    );

    await prisma.activity.createMany({ data: activities });
  }

  await recalculateRanks(); // Update points and ranks
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
