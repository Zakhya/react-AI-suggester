import express from "express";
const app = express();
import morgan from "morgan";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import "express-async-errors";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { body, validationResult } from "express-validator";
import authRouter from "./routers/authRouter.js";
import jobRouter from "./routers/jobRouter.js";
import userRouter from "./routers/userRouter.js";

import { authenticateUser } from "./middleware/authMiddleware.js";

import cookieParser from "cookie-parser";
app.use(cookieParser());
const port = process.env.PORT || 5100;

dotenv.config();
app.use(express.json());
app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: "something went wrong" });
});

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
