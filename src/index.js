import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import categoryRouter from "./routes/categoryRouter.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoryRouter)

const PORT = process.env.PORT;
app.listen(PORT);
