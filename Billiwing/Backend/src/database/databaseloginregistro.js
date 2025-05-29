/**
 * Módulo baseDatos.js
 *
 * Provee funciones para gestionar usuarios en una "base de datos" simple usando localStorage.
 * Este módulo simula persistencia y manejo básico de CRUD para usuarios.
 */

const CLAVE_USUARIOS = 'usuarios_app_login_es';

/**
 * Obtiene la lista de usuarios almacenados en localStorage.
 * @returns {Array} Lista de usuarios (objetos {usuario, correo, contrasenaHash}).
 */
export function obtenerUsuarios() {
  const usuariosStr = localStorage.getItem(CLAVE_USUARIOS);
  if (!usuariosStr) return [];
  try {
    return JSON.parse(usuariosStr);
  } catch {
    return [];
  }
}

/**
 * Guarda la lista de usuarios en localStorage.
 * @param {Array} usuarios - Lista de usuarios a guardar.
 */
export function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

/**
 * Busca un usuario por nombre de usuario o correo electrónico.
 * @param {string} entrada - El nombre de usuario o correo a buscar.
 * @returns {Object|null} El usuario encontrado o null.
 */
export function buscarUsuario(entrada) {
  const usuarios = obtenerUsuarios();
  entrada = entrada.toLowerCase();
  return usuarios.find(
    u => u.usuario.toLowerCase() === entrada || u.correo === entrada
  ) || null;
}

/**
 * Agrega un nuevo usuario a la base de datos.
 * @param {Object} usuario - Objeto usuario con propiedades {usuario, correo, contrasenaHash}.
 * @returns {boolean} true si se agregó con éxito, false si ya existe usuario o correo.
 */
export function agregarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  if (
    usuarios.some(u => u.usuario.toLowerCase() === usuario.usuario.toLowerCase()) ||
    usuarios.some(u => u.correo === usuario.correo)
  ) {
    return false; // Ya existe
  }
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
  return true;
}

/**
 * Función hash simple para contraseñas (no segura para producción).
 * @param {string} texto - Texto a "hashear".
 * @returns {string} Hash como cadena.
 */
export function hashSimple(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

