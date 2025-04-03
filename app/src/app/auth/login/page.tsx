import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="inline-flex items-center justify-center mb-8 text-lg font-medium">
        <BookOpen className="mr-2 h-6 w-6" />
        <span className="font-bold">LibraryHub</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez votre email et votre mot de passe pour accéder à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Vous n'avez pas de compte ?{" "}
            <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
              S'inscrire
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}