const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Validación simple
  if (email === 'admin@test.com' && password === 'password') {
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).send('Invalid credentials');
});

module.exports = router;