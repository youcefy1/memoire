import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  borrowedBooks: [{ 
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    borrowedAt: { type: Date, default: Date.now },
    returnDate: { type: Date },
  }],
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

export default mongoose.model("User", UserSchema);
