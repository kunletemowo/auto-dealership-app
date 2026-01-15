export default function CarValueCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Estimated Car Value Calculator
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Get an instant estimate of your vehicle&apos;s current market value.
        </p>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                Our car value calculator helps you determine the fair market value of your
                vehicle based on make, model, year, mileage, and condition.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Vehicle Make
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800"
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Year
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mileage
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>

            <div className="text-center">
              <button className="rounded-md bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Calculate Value
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            How It Works
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Our calculator uses real market data and current pricing trends to provide you
            with an accurate estimate. Simply enter your vehicle details above and receive
            an instant valuation.
          </p>
        </div>
      </div>
    </div>
  )
}
