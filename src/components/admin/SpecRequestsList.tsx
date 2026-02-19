"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/forms/Button";
import { updateSpecRequestStatus } from "@/app/actions/spec-requests";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface SpecRequest {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  make: string | null;
  model: string | null;
  year_min: number | null;
  year_max: number | null;
  mileage_max: number | null;
  price_min: number | null;
  price_max: number | null;
  transmission: string | null;
  fuel_type: string | null;
  condition_type: string | null;
  color: string | null;
  additional_requirements: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SpecRequestsListProps {
  initialRequests: SpecRequest[];
}

export function SpecRequestsList({ initialRequests }: SpecRequestsListProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<SpecRequest[]>(initialRequests);
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateSpecRequestStatus(id, newStatus);
      if (result.error) {
        showToast(result.error, "error");
      } else {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
        );
        showToast("Status updated successfully", "success");
        router.refresh();
      }
    });
  };

  const downloadPDF = () => {
    // Dynamic import of jsPDF to avoid SSR issues
    import("jspdf").then((jsPDFModule) => {
      const { jsPDF } = jsPDFModule;
      import("jspdf-autotable").then((autoTableModule) => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text("Car Specification Requests", 14, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Prepare table data
        const tableData = requests.map((req) => [
          req.first_name + " " + req.last_name,
          req.email,
          req.phone || "N/A",
          req.make || "Any",
          req.model || "Any",
          req.year_min && req.year_max
            ? `${req.year_min}-${req.year_max}`
            : req.year_min
            ? `${req.year_min}+`
            : req.year_max
            ? `Up to ${req.year_max}`
            : "Any",
          req.mileage_max ? `${req.mileage_max.toLocaleString()} km` : "Any",
          req.price_min && req.price_max
            ? `$${req.price_min.toLocaleString()} - $${req.price_max.toLocaleString()}`
            : req.price_min
            ? `$${req.price_min.toLocaleString()}+`
            : req.price_max
            ? `Up to $${req.price_max.toLocaleString()}`
            : "Any",
          req.transmission || "Any",
          req.fuel_type || "Any",
          req.condition_type || "Any",
          req.color || "Any",
          req.status,
          new Date(req.created_at).toLocaleDateString(),
        ]);

        // Add table
        autoTableModule.default(doc, {
          head: [
            [
              "Name",
              "Email",
              "Phone",
              "Make",
              "Model",
              "Year",
              "Mileage",
              "Price",
              "Transmission",
              "Fuel Type",
              "Condition",
              "Color",
              "Status",
              "Date",
            ],
          ],
          body: tableData,
          startY: 40,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 66, 66] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        // Add additional requirements section
        let yPos = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.text("Additional Requirements", 14, yPos);
        yPos += 10;

        requests.forEach((req, index) => {
          if (req.additional_requirements) {
            doc.setFontSize(10);
            const name = `${req.first_name} ${req.last_name}`;
            doc.text(`${name}:`, 14, yPos);
            yPos += 5;
            doc.setFontSize(9);
            const lines = doc.splitTextToSize(req.additional_requirements, 180);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5 + 5;

            // Add new page if needed
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
          }
        });

        // Save PDF
        doc.save(`car-spec-requests-${new Date().toISOString().split("T")[0]}.pdf`);
        showToast("PDF downloaded successfully", "success");
      });
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "fulfilled":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Download PDF Button */}
      <div className="flex justify-end">
        <Button onClick={downloadPDF} disabled={requests.length === 0}>
          Download PDF Report
        </Button>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            No spec requests found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {request.first_name} {request.last_name}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {request.email}
                    {request.phone && ` • ${request.phone}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.replace("_", " ").toUpperCase()}
                  </span>
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                    disabled={isPending}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                {request.make && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Make:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.make}
                    </span>
                  </div>
                )}
                {request.model && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Model:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.model}
                    </span>
                  </div>
                )}
                {(request.year_min || request.year_max) && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Year:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.year_min && request.year_max
                        ? `${request.year_min}-${request.year_max}`
                        : request.year_min
                        ? `${request.year_min}+`
                        : `Up to ${request.year_max}`}
                    </span>
                  </div>
                )}
                {request.mileage_max && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Max Mileage:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.mileage_max.toLocaleString()} km
                    </span>
                  </div>
                )}
                {(request.price_min || request.price_max) && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Price Range:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.price_min && request.price_max
                        ? `$${request.price_min.toLocaleString()} - $${request.price_max.toLocaleString()}`
                        : request.price_min
                        ? `$${request.price_min.toLocaleString()}+`
                        : `Up to $${request.price_max?.toLocaleString()}`}
                    </span>
                  </div>
                )}
                {request.transmission && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Transmission:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.transmission}
                    </span>
                  </div>
                )}
                {request.fuel_type && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Fuel Type:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.fuel_type}
                    </span>
                  </div>
                )}
                {request.condition_type && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Condition:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.condition_type}
                    </span>
                  </div>
                )}
                {request.color && (
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Color:
                    </span>{" "}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.color}
                    </span>
                  </div>
                )}
              </div>

              {request.additional_requirements && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Additional Requirements:
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {request.additional_requirements}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p
                  className="text-xs text-zinc-500 dark:text-zinc-500"
                  suppressHydrationWarning
                >
                  Submitted:{" "}
                  {new Date(request.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
