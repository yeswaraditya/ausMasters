"use client";

import { AlertCircle } from "lucide-react";

export default function Banner() {
  return (
    <div className="fixed top-14 lg:top-16 left-0 right-0 z-50 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Thank you for using ausMasters!</span> As many students are using this site, I am constantly updating and adding more features, fixing errors. Thank you for your patience and support.
          </p>
        </div>
      </div>
    </div>
  );
}
