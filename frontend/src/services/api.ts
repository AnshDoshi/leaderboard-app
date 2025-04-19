import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getLeaderboard = (filter = "", search = "") =>
  API.get(`/leaderboard?filter=${filter}&search=${search}`);

export const recalculateLeaderboard = () =>
  API.post("/leaderboard/recalculate");
