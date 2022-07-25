import { Router } from "express";
import {listarAlugueis, inserirAluguel, finalizarAluguel, apagarAluguel} from "../controllers/rentalController.js";

const router = Router()

router.get("/rentals", listarAlugueis);

router.post("/rentals", inserirAluguel);

router.post("/rentals/:id/return", finalizarAluguel);

router.delete("/rentals/:id", apagarAluguel);

export default router