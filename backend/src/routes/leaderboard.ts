import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { recalculateRanks } from "../utils/recalculate";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const { filter, search } = req.query;
  let where: any = {};

  if (search) {
    where.id = parseInt(search as string);
  }

  if (filter) {
    const now = new Date();
    let startDate;

    if (filter === "day")
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (filter === "month")
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (filter === "year") startDate = new Date(now.getFullYear(), 0, 1);

    if (startDate) {
      where.activities = {
        some: {
          createdAt: { gte: startDate },
        },
      };
    }
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { rank: "asc" },
    select: {
      id: true,
      fullName: true,
      totalPoints: true,
      rank: true,
    },
  });

  res.json(users);
});

router.post("/recalculate", async (_req, res) => {
  await recalculateRanks();
  res.json({ message: "Leaderboard updated" });
});

export default router;
