import express, { Request, Response } from "express";
import axios from "axios";
import Book, { IBook } from "../models/Book"; // Ensure you have this Mongoose model defined
import User from "../models/User";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

/**
 * GET /api/books/fetch?q=your-query
 * Fetches books from the Google Books API based on the provided query.
 */
router.get("/fetch", async (req: any, res: any) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
    );

    // Extract relevant book data
    const books = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["Unknown Author"],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
      description: item.volumeInfo.description || "No description available",
    }));

    res.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.post("/save", async (req: any, res: any) => {
  try {
    const books: IBook[] = req.body.books; // Ensure TypeScript knows it's an array of books

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ error: "Books array is required" });
    }

    const savedBooks: IBook[] = [];

    for (const book of books) {
      const { id, title, authors, thumbnail, description } = book;

      if (!id || !title) continue; // Skip invalid books

      // Check if book already exists
      const existingBook = await Book.findOne({ id });
      if (!existingBook) {
        const newBook = new Book({
          id,
          title,
          authors,
          thumbnail,
          description,
        });
        await newBook.save();
        savedBooks.push(newBook);
      }
    }

    res.status(201).json({ message: "Books saved successfully", savedBooks });
  } catch (error) {
    console.error("Error saving books:", error);
    res.status(500).json({ error: "Failed to save books" });
  }
});

/**
 * GET /api/books/list
 * Retrieves all saved books from the database.
 */
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = 8;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments(); // Get total books count

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const book = await Book.findOne({ id: req.params.id }); // Use findOne instead of findById
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/favorites", authMiddleware, async (req: any, res: any) => {
  const { userId, bookId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!user.favorites.includes(bookId)) {
    user.favorites.push(bookId);
    await user.save();
  }

  res.json({ success: true, favorites: user.favorites });
});

router.post("/borrow", authMiddleware, async (req: any, res: any) => {
  const { userId, bookId, returnDate } = req.body;

  try {
    console.log("Borrow request:", { userId, bookId, returnDate }); // Debug log

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (!book.available) {
      return res
        .status(400)
        .json({ success: false, message: "Book is not available" });
    }

    // Update book availability
    book.available = false;
    await book.save();

    // Add to user's borrowed books
    const borrowedBook = {
      book: bookId,
      returnDate: new Date(returnDate),
    };

    user.borrowedBooks.push(borrowedBook);
    await user.save();

    res.json({
      success: true,
      borrowedBooks: user.borrowedBooks,
      message: "Book borrowed successfully",
    });
  } catch (error) {
    console.error("Borrow error:", error); // Debug log
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
});

router.get("/user/:id", async (req: any, res: any) => {
  const user = await User.findById(req.params.id).populate(
    "favorites borrowedBooks.book"
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json(user);
});

export default router;
