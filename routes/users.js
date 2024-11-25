import express from "express";
import { authenticateToken } from "../middelwares/auth.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", authenticateToken, async (req, res) => {
  const { db } = req;
  await db.read();
  res.json(db.data.users);
});

// Crear un nuevo usuario
router.post("/", authenticateToken, async (req, res) => {
  const { db } = req;
  const { username, password, ...rest } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "El username no existe y el password es requerido" });
  }

  const newID =
    db.data.users.length > 0
      ? Math.max(...db.data.users.map((user) => user.id)) + 1
      : 1;

  const newUser = {
    id: newID,
    name: "",
    phone: "",
    email: "",
    isUser: false,

    username,
    password,
    ...rest,
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
  };

  db.data.users.push(newUser);
  await db.write();

  res.status(201).json({ message: "Usuario creado", user: newUser });
});

// Actualizar un usuario
router.put("/:id", authenticateToken, async (req, res) => {
  const { db } = req;
  const { id } = req.params;
  const updatedUser = req.body;

  const userIndex = db.data.users.findIndex((u) => u.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  db.data.users[userIndex] = { ...db.data.users[userIndex], ...updatedUser };
  await db.write();

  res.json({ message: "Usuario actualizado", user: db.data.users[userIndex] });
});

// Eliminar un usuario
router.delete("/:id", authenticateToken, async (req, res) => {
  const { db } = req;
  const { id } = req.params;

  db.data.users = db.data.users.filter((u) => u.id !== parseInt(id));
  await db.write();

  res.json({ message: "Usuario eliminado" });
});

export default router;
