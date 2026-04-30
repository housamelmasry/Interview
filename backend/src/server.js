import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
