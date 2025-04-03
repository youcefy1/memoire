import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import booksRoutes from "./routes/books";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());


  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  
  connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
