import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, error, accept, multiple, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="file"
          className={cn(
            "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:file:bg-zinc-50 dark:file:text-zinc-900 dark:file:hover:bg-zinc-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-50",
            error && "border-red-500 dark:border-red-500",
            className
          )}
          accept={accept}
          multiple={multiple}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
