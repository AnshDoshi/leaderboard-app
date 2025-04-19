import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function recalculateRanks() {
  const users = await prisma.user.findMany({
    include: { activities: true },
  });

  const ranked = users
    .map((u) => ({
      id: u.id,
      totalPoints: u.activities.reduce((sum, a) => sum + a.points, 0),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  let rank = 1;
  let prevPoints: number | null = null;

  for (let i = 0; i < ranked.length; i++) {
    if (ranked[i].totalPoints !== prevPoints) {
      rank = i + 1;
      prevPoints = ranked[i].totalPoints;
    }

    await prisma.user.update({
      where: { id: ranked[i].id },
      data: { totalPoints: ranked[i].totalPoints, rank },
    });
  }
}
