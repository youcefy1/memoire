"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock,
  Search,
  User,
  BookMarked,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import ProtectedPage from "./auth/protectedPage";

interface books {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
}
export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/books/list");
        const data = await response.json();
        setBooks(data.books.slice(0, 9));
      } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
                <Link href="#" className="text-sm font-medium">
                  Accueil
                </Link>
                <Link
                  href="/catalog"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
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
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Rechercher</span>
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Compte</span>
                </Button>
                <Avatar className="hidden md:flex h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Utilisateur"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Votre solution de gestion de bibliothèque numérique
                      </h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Organisez, découvrez et gérez votre collection de livres
                        facilement. Suivez les prêts, découvrez de nouvelles
                        lectures et construisez votre bibliothèque personnelle.
                      </p>
                    </div>
                    <div className="flex-col min-[400px]:flex-row">
                      <Button size="lg">Commencer</Button>
                      <Button size="lg" variant="outline">
                        Parcourir le catalogue
                      </Button>
                    </div>
                  </div>
                  <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            Lecture en cours
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-4">
                            <div className="h-24 w-16 rounded bg-muted-foreground/20 flex items-center justify-center">
                              <BookMarked className="h-8 w-8 text-muted-foreground/70" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                Gatsby le Magnifique
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                F. Scott Fitzgerald
                              </p>
                              <div className="mt-2 flex items-center text-sm">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>À rendre dans 7 jours</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            Ajout récent
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-4">
                            <div className="h-24 w-16 rounded bg-muted-foreground/20 flex items-center justify-center">
                              <BookMarked className="h-8 w-8 text-muted-foreground/70" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                Ne tirez pas sur l’oiseau moqueur
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Harper Lee
                              </p>
                              <div className="mt-2">
                                <Badge>Nouveau</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                      Trouvez votre prochaine grande lecture
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Recherchez dans notre vaste catalogue de livres par titre,
                      auteur ou genre.
                    </p>
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <form className="flex space-x-2">
                      <Input
                        className="max-w-lg flex-1"
                        placeholder="Rechercher des livres..."
                        type="search"
                      />
                      <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Rechercher
                      </Button>
                    </form>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                  {books.length > 0 ? (
                    books.map((book) => (
                      <Card key={book.id} className="overflow-hidden">
                        <div className="aspect-[3/4] w-full bg-muted-foreground/20 flex items-center justify-center">
                          {book.thumbnail ? (
                            <img
                              src={book.thumbnail}
                              alt={book.title}
                              className="h-72 w-48 object-cover mb-2 rounded"
                            />
                          ) : (
                            <BookMarked className="h-12 w-12 text-muted-foreground/70" />
                          )}
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="line-clamp-1">
                            {book.title}
                          </CardTitle>
                          <CardDescription className="overflow-hidden inline-block whitespace-nowrap overflow-ellipsis">
                            {book.authors?.join(", ") || "Inconnu"}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <CardDescription className="overflow-hidden inline-block whitespace-nowrap overflow-ellipsis">
                            {book.description}
                          </CardDescription>
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p>Aucun livre trouvé.</p>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button variant="outline">Voir tous les livres</Button>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                      Fonctionnalités
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Tout ce dont vous avez besoin pour gérer votre
                      bibliothèque personnelle ou institutionnelle.
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <BookOpen className="h-10 w-10 mb-2" />
                      <CardTitle>Gestion du catalogue</CardTitle>
                      <CardDescription>
                        Organisez vos livres avec des métadonnées détaillées,
                        des étiquettes et des catégories personnalisées.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Clock className="h-10 w-10 mb-2" />
                      <CardTitle>Suivi des prêts</CardTitle>
                      <CardDescription>
                        Suivez les livres empruntés, les dates d'échéance et
                        l'historique de lecture.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <BarChart3 className="h-10 w-10 mb-2" />
                      <CardTitle>Analyse de lecture</CardTitle>
                      <CardDescription>
                        Visualisez vos habitudes de lecture et suivez vos
                        progrès au fil du temps.
                      </CardDescription>
                    </CardHeader>
                  </Card>
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
