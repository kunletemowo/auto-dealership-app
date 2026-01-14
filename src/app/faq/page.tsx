export default function FAQPage() {
  const faqs = [
    {
      question: "How do I list my car for sale?",
      answer:
        "To list your car, simply create an account, go to the 'List Your Car' page, fill out the vehicle details, upload photos, and publish your listing. It's free to list your vehicle.",
    },
    {
      question: "Are there any fees for using the platform?",
      answer:
        "Listing your vehicle is completely free. We may charge a small commission or transaction fee for successful sales, but you'll be notified of any applicable fees before completing the transaction.",
    },
    {
      question: "How do I contact a seller?",
      answer:
        "When you find a vehicle you're interested in, you can view the seller's contact information on the listing page. You can call, text, or email the seller directly through the contact information provided.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take your privacy seriously. Your personal information is encrypted and stored securely. We only share contact information with buyers and sellers when necessary for transactions.",
    },
    {
      question: "Can I edit or delete my listing?",
      answer:
        "Yes, you can edit or delete your listings at any time from your dashboard. Simply go to 'My Listings' and select the listing you want to modify or remove.",
    },
    {
      question: "How do I know if a listing is legitimate?",
      answer:
        "We verify seller accounts and encourage users to report suspicious listings. Always meet in a safe, public location and verify the vehicle's condition and documentation before making a purchase.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "Payment methods vary by seller. We recommend discussing payment options directly with the seller. For high-value transactions, consider using secure payment methods or escrow services.",
    },
    {
      question: "Do you offer vehicle financing?",
      answer:
        "While we don't directly offer financing, many of our sellers work with financing partners. You can also arrange your own financing through banks or credit unions before purchasing.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Find answers to common questions about buying and selling vehicles on our platform.
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {faq.question}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Still have questions?
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            If you can&apos;t find the answer you&apos;re looking for, please don&apos;t hesitate
            to{" "}
            <a href="/contact" className="text-zinc-900 underline dark:text-zinc-50">
              contact us
            </a>
            . Our team is here to help!
          </p>
        </div>
      </div>
    </div>
  )
}
