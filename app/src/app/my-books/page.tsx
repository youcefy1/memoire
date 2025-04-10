"use client"

import Link from "next/link"
import { BookOpen, Clock, Heart, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from 'react';
interface Book {
    id: string;
    title: string;
    authors: string[];
    thumbnail?: string;
    description?: string;
  }

  interface BorrowedBook {
    book: Book;
    borrowedAt: string;
    returnDate: string;
    _id: string;
  }

  interface BorrowedBooksData {
    borrowedBooks: BorrowedBook[];
  }


// Calculate days remaining
const getDaysRemaining = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default function MyBooksPage() {
    const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
          try {
            const response = await fetch(`http://localhost:8080/api/books/user/${user.id}`);
            const data = await response.json();
            console.log("data: ",data.borrowedBooks);
            setBorrowedBooks(data.borrowedBooks);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchBorrowedBooks();
      }, []);
    
      if (loading) {
        return <p>Loading...</p>;
      }
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">LibraryHub</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Catalog
            </Link>
            <Link href="/my-books" className="text-sm font-medium">
              My Books
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">My Books</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Manage your borrowed books and favorites all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="borrowed" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="borrowed" className="space-y-8">
                {borrowedBooks && borrowedBooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No books currently borrowed</h3>
                    <p className="text-muted-foreground mt-2 mb-6">
                      You don't have any books checked out at the moment.
                    </p>
                    <Link href="/catalog">
                      <Button>Browse Catalog</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Currently Borrowed</h2>
                      <p className="text-sm text-muted-foreground">
                        {borrowedBooks.length} {borrowedBooks.length === 1 ? "book" : "books"} borrowed
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {borrowedBooks.map((borrowedBook) => {
                        // const daysRemaining = getDaysRemaining(book.dueDate)
                        // const isOverdue = daysRemaining < 0
                        // const isDueSoon = daysRemaining >= 0 && daysRemaining <= 3

                        return (
                            <Card key={borrowedBook.book._id} className="overflow-hidden h-full">
                            <div className="flex p-6">
                              <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                {borrowedBook.book.thumbnail ? (
                                  <img
                                    src={borrowedBook.book.thumbnail}
                                    alt={`Cover of ${borrowedBook.book.title}`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <BookOpen className="h-8 w-8 text-muted-foreground/70" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between">
                                    <h3 className="text-lg font-medium">
                                      <Link href={`/catalog/${borrowedBook.book.id}`} className="hover:text-primary">
                                        {borrowedBook.book.title}
                                      </Link>
                                    </h3>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">{borrowedBook.book.authors.join(', ')}</p>
                                </div>
                                <div className="mt-auto pt-2">
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Borrowed on {new Date(borrowedBook.borrowedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Due on {new Date(borrowedBook.returnDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CardFooter className="border-t bg-muted/50 px-6 py-3">
                              <div className="flex justify-between w-full">
                                <Button variant="outline" size="sm" className="h-8">
                                  Return
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8">
                                  Renew
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        )
                      })}
                    </div>

                    <div className="flex justify-center mt-8">
                      <Link href="/catalog">
                        <Button variant="outline">Borrow More Books</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* <TabsContent value="favorites" className="space-y-8">
                {favoriteBooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No favorite books yet</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Add books to your favorites for quick access.</p>
                    <Link href="/catalog">
                      <Button>Browse Catalog</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Favorite Books</h2>
                      <p className="text-sm text-muted-foreground">
                        {favoriteBooks.length} {favoriteBooks.length === 1 ? "book" : "books"} in your favorites
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {favoriteBooks.map((book) => (
                        <Card key={book.id} className="overflow-hidden h-full">
                          <div className="aspect-[2/3] relative bg-muted">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage || "/placeholder.svg"}
                                alt={`Cover of ${book.title}`}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <BookOpen className="h-12 w-12 text-muted-foreground/70" />
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove from favorites</span>
                            </Button>
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="line-clamp-1">
                              <Link href={`/catalog/${book.id}`} className="hover:text-primary">
                                {book.title}
                              </Link>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </CardHeader>
                          <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            <Badge variant={book.available ? "outline" : "secondary"}>
                              {book.available ? "Available" : "Borrowed"}
                            </Badge>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-1">{book.rating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent> */}
            </Tabs>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 LibraryHub. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

