import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import routes from "./routes";

dotenv.config();
console.log("Environment variables loaded");

const app = express();

// Config CORS
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Logs das reqs
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('API is working:', res);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// testes
app.get("/", (req: Request, res: Response) => {
  console.log('API is working:', req);
  res.json({ message: "API is working" });
});

// Rotas 
app.use(routes);

const PORT = process.env.PORT || 3006;

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Available routes:");
      console.log("  GET  /");
      console.log("  GET  /produtores");
      console.log("  POST /produtores");
      console.log("  PUT  /produtores/:id");
      console.log("  DEL  /produtores/:id");
      console.log("  GET  /dashboard");
    });
  })
  .catch((error: Error) => {
    console.error("Error during Data Source initialization:", error);
  }); 