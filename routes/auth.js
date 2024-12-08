import express from "express";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const SECRET_KEY = "mySecretKey123";

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { db } = req;
  

  //Verifica credenciales
  const user = db.data.users.find(
    (item) => item.email === email && item.password === password
  );

  if (!email.includes('@')) {
    return res.status(401).json({
      message:'No es un correo'
    })
  }

  if (!user) {
    return res.status(401).json({
      message: "Credenciales invalidas",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    SECRET_KEY,
    {
      expiresIn: "5h",
    }
  );

  res.json({
    token,
  });
});

export default authRouter;
