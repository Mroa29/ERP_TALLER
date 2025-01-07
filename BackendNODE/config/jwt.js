const jwt = require('jsonwebtoken');

// Importar variables de entorno desde el archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

/**
 * Genera un token JWT para un usuario.
 * @param {Object} payload - Datos que se incluirán en el token (e.g., id del usuario, rol).
 * @returns {string} - Token JWT generado.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * Verifica la validez de un token JWT.
 * @param {string} token - Token JWT a validar.
 * @returns {Object} - Información decodificada del token si es válido.
 * @throws {Error} - Error si el token no es válido o está expirado.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token no válido o expirado');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
