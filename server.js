console.log("server is working...");
import express from "express";
const app = express();
import morgan from "morgan";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import jobRouter from "./routers/jobRouter.js";
const port = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/jobs", jobRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: "something went wrong" });
});

app.listen(port, () => {
  console.log(`server running on PORT ${port}....`);
});
