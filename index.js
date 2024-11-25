import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { join } from "path";
import { JSONFile } from "lowdb/node";
import { JSONFilePreset } from "lowdb/node";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";

const app = express();

//Importante para checar el puerto desde el front
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());

//Configuration de LowDB
const file = join(process.cwd(), "db.json");
const adapter = new JSONFile(file);

// const defaultData = { users: [] }
const db = await JSONFilePreset("db.json", adapter);

//Inicializar base de datos
async function initialBD() {
  await db.read();
  if (!db.data) {
    db.data = { users: [] };
    await db.write();
  }
}

initialBD();

//Rutas

app.use(
  "/auth",
  (req, res, next) => {
    req.db = db;
    next();
  },
  authRoutes
);

app.use(
  "/users",
  (req, res, next) => {
    req.db = db;
    next();
  },
  usersRoutes
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor Corriendo en el puerto http://localhost:${PORT}`);
});
