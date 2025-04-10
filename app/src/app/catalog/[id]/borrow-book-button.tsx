"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  available: boolean;
}

export default function BorrowBookButton({ book }: { book: Book }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 14)); // Default to 14 days from now
  const [isLoading, setIsLoading] = useState(false);

  // Calculate the minimum date (today) and maximum date (30 days from now)
  const today = new Date();
  const maxDate = addDays(today, 30);

  // First add these imports at the top

  // Then modify the handleBorrow function
  const handleBorrow = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!date) {
      toast.error("Please select a return date");
      return;
    }

    if (!token || !user.id) {
      toast.error("You must be logged in to borrow books");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          bookId: book._id,
          returnDate: date.toISOString(), // Convert date to ISO string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to borrow book");
      }

      const data = await response.json();
      setOpen(false);
      toast.success(
        `Book borrowed successfully! Return date: ${format(date, "PPP")}`
      );
      router.push("/my-books");
    } catch (error) {
      console.error("Borrow error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to borrow book. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={!book.available}>
          {book.available ? "Borrow Book" : "Join Waitlist"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow Book</DialogTitle>
          <DialogDescription>
            You are borrowing "{book.title}" by {book.authors}. Please select
            your expected return date.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-4">
              <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.authors}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="return-date" className="text-sm font-medium">
              Return Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="return-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-50 pointer-events-auto"
                align="start"
              >
                <Calendar
                  mode="single"
                  className=""
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    if (date) {
                      const trigger = document.activeElement as HTMLElement;
                      trigger?.blur();
                    }
                  }}
                  disabled={(date) => date < today || date > maxDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              You can borrow this book for up to 30 days. Standard loan period
              is 14 days.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleBorrow} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Borrowing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
