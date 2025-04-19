import app from "./app";

const PORT = process.env.PORT;

app
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
  });
