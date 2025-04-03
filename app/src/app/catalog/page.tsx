"use client";

import Link from "next/link";
import { BookOpen, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import ProtectedPage from "../auth/protectedPage";

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
}

export default function CatalogPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/books/list?page=${page}`
        );
        const data = await response.json();
        setBooks(data.books);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  return (
    <ProtectedPage>
      <div className="flex justify-center items-center flex-col text-center">
      <div className="flex min-h-screen flex-col xl:min-w-[97rem]">
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
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Catalogue de livres
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Parcourez notre vaste collection de livres à travers divers
                    genres et auteurs.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher par titre, auteur ou ISBN..."
                      className="w-full pl-8"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-[180px]">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les genres</SelectItem>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-fiction</SelectItem>
                        <SelectItem value="mystery">Mystère</SelectItem>
                        <SelectItem value="sci-fi">Science-fiction</SelectItem>
                        <SelectItem value="fantasy">Fantastique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-[180px]">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Disponibilité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="borrowed">Emprunté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filtrer</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.length > 0 ? (
                  books.map((book) => (
                    <Link
                      href={`/catalog/${book.id}`}
                      key={book.id}
                      className="group"
                    >
                      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                        <div className="aspect-[2/3] relative bg-muted">
                          <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
                            {book.thumbnail ? (
                              <img
                                src={book.thumbnail || "/placeholder.svg"}
                                alt={`Couverture de ${book.title}`}
                                className="object-cover h-96 w-60"
                              />
                            ) : (
                              <BookOpen className="h-12 w-12 text-muted-foreground/70" />
                            )}
                          </div>
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                            {book.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {book.authors}
                          </p>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                          {/* <Badge variant={book.available ? "outline" : "secondary"}>
                        {book.available ? "Disponible" : "Emprunté"}
                      </Badge> */}
                          {/* <span className="text-sm font-medium">{book.rating} ★</span> */}
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <p>Aucun livre trouvé.</p>
                )}
              </div>
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink className="hover:bg-inherit">
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        className="cursor-pointer"
                        onClick={() =>
                          setPage((prev) =>
                            prev < totalPages ? prev + 1 : prev
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 LibraryHub. Tous droits réservés.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Conditions
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Confidentialité
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
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
