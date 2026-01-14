import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-zinc-900 py-24 dark:bg-zinc-950 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Join thousands of buyers and sellers on our platform. Create your
            account today and start buying or selling.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
            >
              Get started
            </Link>
            <Link
              href="/cars"
              className="text-base font-semibold leading-6 text-white transition-colors hover:text-zinc-300"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
