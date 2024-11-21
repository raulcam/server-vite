const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Permitir solo este origen
  })
);

// Middleware para validar token
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "123") {
    next();
  } else {
    res.status(401).json({ error: "Token inválido" });
  }
});

// Endpoint de datos
app.get("/data", (req, res) => {
  res.json({ message: "Datos obtenidos correctamente", items: [1, 2, 3] });
});

app.listen(4000, () =>
  console.log("Servidor corriendo en http://localhost:4000")
);
