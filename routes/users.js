import express from "express";
import { authenticateToken } from "../middelwares/auth.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Obtener todos los usuarios
router.get("/", authenticateToken, async (req, res) => {
  const { db } = req;
  await db.read();

  res.json(db.data.users);
});

//Obtener un solo elemento del arrego

router.get("/:id", authenticateToken, async (req,res)=>{
  const {db} = req;
 
  const { id } = req.params;
  const updatedUser = req.body;

  const userIndex = db.data.users.findIndex((item)=> item.id === parseInt(id));
  console.log(userIndex);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  await db.write();
  res.json({user:db.data.users[userIndex]});
})

// Crear un nuevo usuario
router.post("/", authenticateToken, async (req, res) => {
  const { db } = req;
  const { email, password, ...rest } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "El email no existe y el password es requerido" });
  }
  if (!email.includes("@")) {
    return res.status(401).json({ message: "No es un correo valido" });
  }
  //Creaciond de un id
  const newID =
    db.data.users.length > 0
      ? Math.max(...db.data.users.map((user) => user.id)) + 1
      : 1;

  // password, 
  const newUser = {
    id: newID,
    name: "",
    phone: "",
    username: "",
    email,
    isUser: false,
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

  db.data.users = db.data.users.filter((u) => u.id !== (id));
  await db.write();

  res.json({ message: "Usuario eliminado" });
});

export default router;
