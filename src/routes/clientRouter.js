import { Router } from "express";
import {listarClientes, listarClienteId, inserirCliente, atualizarCliente} from "../controllers/clientController.js";
import validateBody from "../middlewares/validateBodySchema.js";
import clientSchema from "../schemas/clientSchema.js"

const router = Router()

router.get("/customers", listarClientes);

router.get("/customers/:id", listarClienteId);

router.post("/customers", validateBody(clientSchema), inserirCliente);

router.put("/customers/:id", validateBody(clientSchema), atualizarCliente);

export default router