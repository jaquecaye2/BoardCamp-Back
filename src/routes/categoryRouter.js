import { Router } from "express";
import {listarCategorias, inserirCategoria} from "../controllers/categoryControler.js";
import validateBody from "../middlewares/validateBodySchema.js";
import categorySchema from "../schemas/categorySchema.js"

const router = Router()

router.get("/categories", listarCategorias);

router.post("/categories", validateBody(categorySchema), inserirCategoria)

export default router