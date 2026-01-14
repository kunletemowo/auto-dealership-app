export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          We&apos;re here to help. Get in touch with our team for any questions or support.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Get in Touch
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Email</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    support@kuldaeautos.com
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Phone</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">1-800-555-0123</p>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    Business Hours
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Monday - Friday: 9:00 AM - 6:00 PM EST
                    <br />
                    Saturday: 10:00 AM - 4:00 PM EST
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Office Location
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                123 Auto Sales Street
                <br />
                Toronto, ON M5H 2N2
                <br />
                Canada
              </p>
            </section>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Send us a Message
            </h2>
            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Subject
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
