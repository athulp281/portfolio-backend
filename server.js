import dotenv from "dotenv";
dotenv.config();
import { initRAG } from "./src/services/rag.service.js";

import app from "./app.js";

const PORT = 5000;

const start = async () => {
  await initRAG();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
