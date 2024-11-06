// Cargar dotenv para acceder a las variables de entorno
require('dotenv').config();

// Importar el módulo pg
const { Pool } = require('pg');

// Configuración del pool de conexiones
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' // Convierte el valor de string a booleano
});

// Función para conectar y verificar la conexión
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar a la base de datos:', err.stack);
    }
    console.log('Conectado a la base de datos');
    release(); // Liberar el cliente una vez verificada la conexión
});

// Exportar el pool para que esté disponible en otros módulos
module.exports = pool;
