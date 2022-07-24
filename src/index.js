import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import categoryRouter from "./routes/categoryRouter.js"
import gameRouter from "./routes/gameRouter.js"
import clientRouter from "./routes/clientRouter.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoryRouter)
app.use(gameRouter)
app.use(clientRouter)

const PORT = process.env.PORT;
app.listen(PORT);
