import express from "express";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const SECRET_KEY = "mySecretKey123";

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { db } = req;
  

  //Verifica credenciales
  const user = db.data.users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Credenciales invalidas",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
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
