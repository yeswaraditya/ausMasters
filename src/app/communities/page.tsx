"use client";

import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";

export default function Communities() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Communities
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Join WhatsApp groups to connect with other students, get updates, and share experiences.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-amber-700 font-medium">Coming Soon</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}