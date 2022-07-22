import { Router } from "express";
import {listarJogos, inserirJogo} from "../controllers/gameController.js";
import validateBody from "../middlewares/validateBodySchema.js";
import gameSchema from "../schemas/gameSchema.js"

const router = Router()

router.get("/games", listarJogos);

router.post("/games", validateBody(gameSchema), inserirJogo)

export default router