import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Route d'inscription
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Le nom est requis"),
    body("email").isEmail().withMessage("Email invalide"),
    body("password").isLength({ min: 6 }).withMessage("Mot de passe trop court"),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "Email déjà utilisé" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });

      await user.save();
      res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// Route de connexion
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Identifiants incorrects" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Identifiants incorrects" });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

export default router;
