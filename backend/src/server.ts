import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import routes from "./routes";

dotenv.config();
console.log("Environment variables loaded");

const app = express();

// Confg CORS
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Logs das reqs
app.use((req, res, next) => {
  console.log('API is workin:', res);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// testes
app.get("/", (req, res) => {
  console.log('API is workin:', req);
  res.json({ message: "API is working" });
});

// Rotas 
app.use(routes);

const PORT = process.env.PORT || 3000;

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
  .catch(error => {
    console.error("Error during Data Source initialization:", error);
  }); 