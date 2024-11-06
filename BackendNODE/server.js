require('dotenv').config();
const express = require('express');
const app = require('./app');


app.use(express.json());

// Puerto desde variables de entorno o valor por defecto
const PORT = process.env.PORT || 3000;

// Ruta básica para verificar que el servidor está corriendo
app.get('/', (req, res) => {
    res.send('Servidor en funcionamiento');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
