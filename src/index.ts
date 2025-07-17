import express from "express";
import authRouter from "./routes/user";
import notesRouter from "./routes/notes";
const app = express();
app.use(express.json());

const port = process.env.port || 2345;

app.get("/", async (_req, res) => {
  res.send("<h1>Welcome to T's API</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/entries", notesRouter);

app.listen(port, () => {
  console.log(`App is up and running on port ${port}`);
});
