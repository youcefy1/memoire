import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
}

const BookSchema = new Schema<IBook>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  thumbnail: { type: String },
  description: { type: String },
});

const Book = mongoose.model<IBook>("Book", BookSchema);

export default Book;
