import express from "express";
import cors from "cors";
import leaderboardRoutes from "./routes/leaderboard";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/leaderboard", leaderboardRoutes);

export default app;
