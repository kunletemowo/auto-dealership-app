export default function BlogPage() {
  const posts = [
    {
      title: "Top 10 Tips for Buying a Used Car",
      date: "March 15, 2024",
      excerpt:
        "Learn the essential tips and tricks for finding and purchasing a reliable used vehicle that fits your needs and budget.",
    },
    {
      title: "How to Prepare Your Car for Sale",
      date: "March 10, 2024",
      excerpt:
        "Maximize your car's value with these expert tips on cleaning, maintenance, and presentation before listing.",
    },
    {
      title: "Understanding Vehicle History Reports",
      date: "March 5, 2024",
      excerpt:
        "A comprehensive guide to reading and understanding vehicle history reports to make informed purchasing decisions.",
    },
    {
      title: "Electric vs. Gasoline: Making the Right Choice",
      date: "February 28, 2024",
      excerpt:
        "Compare the pros and cons of electric and gasoline vehicles to determine which option is best for your lifestyle.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Blog</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Stay informed with the latest tips, guides, and insights about buying and selling
          vehicles.
        </p>

        <div className="mt-8 space-y-6">
          {posts.map((post, index) => (
            <article
              key={index}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{post.date}</p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
              <a
                href="#"
                className="mt-4 inline-block text-zinc-900 underline dark:text-zinc-50"
              >
                Read more →
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Check back soon for more articles and updates!
          </p>
        </div>
      </div>
    </div>
  )
}
