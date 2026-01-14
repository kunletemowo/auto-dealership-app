export default function ProtectionPlansPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Protection Plans
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Protect your investment with our comprehensive vehicle protection plans.
        </p>

        <div className="mt-8 space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Extended Warranty
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Extend your vehicle&apos;s warranty coverage beyond the manufacturer&apos;s warranty
              period. Our extended warranty plans provide peace of mind and protect against
              unexpected repair costs.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-6 text-zinc-600 dark:text-zinc-400">
              <li>Coverage for major components and systems</li>
              <li>Flexible term options</li>
              <li>Nationwide network of certified repair facilities</li>
              <li>24/7 roadside assistance</li>
            </ul>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              GAP Insurance
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Protect yourself from the difference between what you owe on your vehicle and
              its actual cash value in the event of a total loss. GAP insurance covers the
              gap between your loan balance and insurance payout.
            </p>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Vehicle Service Contracts
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Comprehensive service contracts that cover repairs and maintenance beyond your
              warranty period. Keep your vehicle running smoothly with our flexible service
              contract options.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Why Choose Our Protection Plans?
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
              <li>Affordable monthly payments</li>
              <li>Transferable coverage (increases resale value)</li>
              <li>No deductible options available</li>
              <li>Easy claims process</li>
              <li>Coverage accepted at thousands of repair facilities</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
