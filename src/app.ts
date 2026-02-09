import express, { json } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import { chatRouter } from "./routes/chat.js";

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 requests per windowMs
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 64,
});

app.disable("x-powered-by");
app.use(json());
app.use(cors());

app.use(chatRouter);
app.use(limiter);

export { app };
