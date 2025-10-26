const { Pool } = require('pg');

// Configuración del pool de conexiones a PostgreSQL
// Lee las variables de entorno definidas en docker-compose
const pool = new Pool({
  host: process.env.DB_HOST,       // Host de la base de datos
  port: process.env.DB_PORT,       // Puerto de PostgreSQL
  user: process.env.DB_USER,       // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME,   // Nombre de la base de datos
});

// Evento que se dispara al conectar exitosamente
pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

// Evento que se dispara si hay un error en la conexión
pool.on('error', (err) => {
  console.error('Error en la conexion a PostgreSQL:', err);
});

// Exportar el pool para usarlo en otros módulos
module.exports = pool;