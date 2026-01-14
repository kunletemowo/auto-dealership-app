import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              AutoSales
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The best platform to buy and sell cars. Connect with buyers and
              sellers in your area.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              For Buyers
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/cars" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Search Listings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              For Sellers
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/cars/new" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  List Your Car
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-listings" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  My Listings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} AutoSales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
