"use client";

import { useAppData } from "@/context/DataContext";

export default function DataErrorBanner() {
  const { error } = useAppData();
  if (!error) return null;

  return (
    <div className="border-b border-critical/30 bg-critical/10 px-4 py-2 text-center text-sm text-critical sm:px-6">
      {error}
    </div>
  );
}
