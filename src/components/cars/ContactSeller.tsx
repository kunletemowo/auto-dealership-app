"use client";

import { useState } from "react";
import { Button } from "@/components/forms/Button";
import { formatPhoneNumber } from "@/lib/utils/phone";

// Simple X icon SVG component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

interface ContactSellerProps {
  sellerId: string;
  sellerName: string;
  sellerPhone?: string | null;
  carTitle: string;
  carId: string;
}

export function ContactSeller({
  sellerId,
  sellerName,
  sellerPhone,
  carTitle,
  carId,
}: ContactSellerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Construct mailto link with subject and body
  const emailSubject = encodeURIComponent(`Inquiry about: ${carTitle}`);
  const emailBody = encodeURIComponent(
    `Hi ${sellerName},\n\nI'm interested in the car listing: ${carTitle}\n\nPlease contact me to discuss further.\n\nThank you!`
  );

  if (!isOpen) {
    return (
      <Button
        className="mt-4"
        variant="primary"
        onClick={() => setIsOpen(true)}
      >
        Contact Seller
      </Button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Contact Seller
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Contact <span className="font-medium">{sellerName}</span> about:
              </p>
              <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                {carTitle}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Phone:
                </p>
                {sellerPhone ? (
                  <a
                    href={`tel:${sellerPhone}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {formatPhoneNumber(sellerPhone)}
                  </a>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Not provided
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Contact via Email:
                </p>
                <a
                  href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
                  className="inline-block"
                >
                  <Button variant="outline" size="sm">
                    Open Email Client
                  </Button>
                </a>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  This will open your default email client with a pre-filled message
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
