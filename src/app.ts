import express, { json } from "express";
import cors from "cors";

import { chatRouter } from "./routes/chat.js";

const app = express();

app.use(json());
app.use(cors());

app.use(chatRouter);

export { app };
