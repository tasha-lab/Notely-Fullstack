import express from "express";
import authRouter from "./routes/user";
import notesRouter from "./routes/notes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://notely-frontend-iota.vercel.app",
      "http://localhost:5173",
      "https://notely-frontend-git-main-tasha-labs-projects.vercel.app/",
    ],
    // origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

const port = process.env.port || 2345;

app.get("/", async (_req, res) => {
  res.send("<h1>Welcome to T's API</h1>");
});
app.get("/health", (_req, res) => {
  res.status(200).send(" Notely API is healthy");
});
app.use("/api/auth", authRouter);
app.use("/api/entries", notesRouter);

app.listen(port, () => {
  console.log(`App is up and running on port ${port}`);
});
