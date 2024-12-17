import { Router } from "express";
import { ProducerController } from "./controllers/ProducerController";
import { DashboardController } from "./controllers/DashboardController";

const router = Router();
const producerController = new ProducerController();
const dashboardController = new DashboardController();

// Rota para testes teste
router.get("/test", (req, res) => {
    console.log('API is workin:', req.method, req.url);
  res.json({ message: "API is working" });
});

// Rotas de produtores por id e etc
router.post("/produtores", (req, res) => producerController.create(req, res));
router.put("/produtores/:id", (req, res) => producerController.update(req, res));
router.delete("/produtores/:id", (req, res) => producerController.delete(req, res));
router.get("/produtores", (req, res) => producerController.findAll(req, res));
router.get("/dashboard", (req, res) => dashboardController.getData(req, res));

console.log("Routes registered:", router.stack.map(r => r.route?.path).filter(Boolean));

export default router; 