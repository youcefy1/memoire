"use client";

import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Share2,
  Star,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedPage from "@/app/auth/protectedPage";
import BorrowBookButton from "./borrow-book-button";

interface Book {
  _id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  available: boolean;
}

export default function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails du livre :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  console.log(
    fetch(`http://localhost:8080/api/books/${id}`)
      .then((res) => res.text())
      .then((data) => console.log(data))
  );

  if (loading) return <p>Chargement...</p>;
  if (!book) return <p>Livre non trouvé.</p>;

  return (
    <ProtectedPage>
      <div className="flex justify-center items-center flex-col min-h-[100vh] text-center">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">LibraryHub</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Accueil
              </Link>
              <Link href="/catalog" className="text-sm font-medium">
                Catalogue
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Mes livres
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                À propos
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">S'inscrire</Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] relative bg-muted rounded-lg overflow-hidden">
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-24 w-24 text-muted-foreground/70" />
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-4">
                <BorrowBookButton book={book} />
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>

                </div>
              </div>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={book.available ? "outline" : "secondary"}>
                      {book.available ? "Available" : "Borrowed"}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{book.title}</h1>
                  <p className="text-xl text-muted-foreground mt-1">by {book.authors}</p>
                </div>

                <Separator />

                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4 space-y-4">
                    <p>{book.description}</p>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4">
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
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
    </div>
    </ProtectedPage>
  );
}
