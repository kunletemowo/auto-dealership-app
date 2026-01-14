export default function CareersPage() {
  const positions = [
    {
      title: "Senior Typescript Developer",
      location: "Remote / Toronto, ON",
      type: "Full-time",
      description:
        "We're looking for an experienced software engineer to help build and scale our platform. You'll work with modern technologies and contribute to a product that makes a real difference.",
    },
    {
      title: "Product Designer",
      location: "Toronto, ON",
      type: "Full-time",
      description:
        "Join our design team to create beautiful, intuitive experiences for our users. You'll work on everything from user flows to visual design.",
    },
    {
      title: "Customer Success Manager",
      location: "Remote",
      type: "Full-time",
      description:
        "Help our users succeed on our platform. You'll work directly with buyers and sellers to ensure they have the best possible experience.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Careers
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Join our team and help shape the future of online vehicle sales.
        </p>

        <div className="mt-8">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Why Work With Us?
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              At Kuldae Autos, we&apos;re building a platform that makes buying and selling
              vehicles easier and more transparent. We value innovation, collaboration, and
              a commitment to excellence.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
              <li>Competitive compensation and benefits</li>
              <li>Flexible work arrangements</li>
              <li>Opportunities for professional growth</li>
              <li>Collaborative and inclusive work environment</li>
              <li>Impactful work that makes a difference</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Open Positions
            </h2>
            <div className="mt-4 space-y-4">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col justify-between md:flex-row md:items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {position.title}
                      </h3>
                      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                        {position.location} • {position.type}
                      </p>
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {position.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Don&apos;t see a position that fits?
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              We&apos;re always looking for talented individuals to join our team. Feel free
              to{" "}
              <a href="/contact" className="text-zinc-900 underline dark:text-zinc-50">
                reach out
              </a>{" "}
              with your resume and a note about how you&apos;d like to contribute.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
