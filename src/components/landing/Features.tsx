export function Features() {
  const features = [
    {
      title: "Easy Listing",
      description:
        "Create a listing in minutes with our simple, step-by-step process. Upload photos and set your price.",
      icon: "📝",
    },
    {
      title: "Secure Transactions",
      description:
        "Built-in security features and verified seller profiles help ensure safe transactions.",
      icon: "🔒",
    },
    {
      title: "Advanced Search",
      description:
        "Filter by make, model, year, price, and more to find exactly what you're looking for.",
      icon: "🔍",
    },
    {
      title: "Local Listings",
      description:
        "Find cars in your area and connect with sellers nearby for easy test drives.",
      icon: "📍",
    },
  ];

  return (
    <section className="bg-white py-24 dark:bg-black sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Everything you need to buy or sell
          </h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Our platform makes it easy to connect buyers and sellers.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="text-4xl leading-7 text-zinc-900 dark:text-zinc-50">
                  {feature.icon}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  <p className="flex-auto font-semibold text-zinc-900 dark:text-zinc-50">
                    {feature.title}
                  </p>
                  <p className="mt-1 flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
