export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          About Us
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to Kuldae Autos, your trusted partner to connect buyers and sellers for the best car deals in Canada.
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Our Mission
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Our mission is to simplify the car buying and selling experience by providing a
              transparent, user-friendly platform that connects buyers and sellers across Canada.
              We are committed to making vehicle transactions seamless and trustworthy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Who We Are
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Kuldae Autos is a leading online market hub for connecting buyers and sellers of vehicles while removing the middlemen.
              With years of experience in the automotive industry, we understand the challenges
              that come with vehicle transactions and have built a platform that addresses
              these challenges head-on.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              What We Offer
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
              <li>Comprehensive vehicle listings with detailed information</li>
              <li>Advanced search and filtering capabilities</li>
              <li>Secure platform for both buyers and sellers</li>
              <li>User-friendly interface for managing listings</li>
              <li>Trusted marketplace with verified sellers with community strategy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Our Values
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              We believe in transparency, trust, simplicity, community, personalization and customer satisfaction. Every feature on
              our platform is designed with our users in mind, ensuring a smooth and reliable
              experience whether you&apos;re buying your next vehicle or selling your current one.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
