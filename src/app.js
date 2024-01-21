import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credential: true,
  }),
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes

import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);

export { app };
