// API básica usando Node.js + Express
// Ejecuta: npm install express cors
// Ejecuta: node api.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let pedidos = [];

app.post('/api/pedidos', (req, res) => {
    const { cantidad } = req.body;
    if (!cantidad || cantidad < 1) {
        return res.status(400).json({ error: 'Cantidad inválida' });
    }
    const pedido = { id: pedidos.length + 1, cantidad, fecha: new Date() };
    pedidos.push(pedido);
    res.status(201).json(pedido);
});

app.get('/api/pedidos', (req, res) => {
    res.json(pedidos);
});

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
