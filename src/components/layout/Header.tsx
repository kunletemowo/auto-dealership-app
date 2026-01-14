import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-black/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/kuldae-autos-logo.png"
            alt="Kuldae Autos"
            width={200}
            height={80}
            className="h-16 w-auto object-contain"
            unoptimized
            priority
          />
        </Link>
        
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/cars"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Browse Cars
          </Link>
          <Link
            href="/cars/new"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Sell Your Car
          </Link>
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}
