// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import { Usuarios } from "../models/usuarios.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si ya existe un usuario con ese email
    const existingUser = await Usuarios.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = await Usuarios.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Usuario registrado con éxito", userId: newUser.id });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
