"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function Feedback() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Feature Requests & Feedback
            </h1>
          </div>
          <p className="text-gray-600 text-center max-w-md mx-auto">
            Have ideas to improve ausMasters? Share your feedback, suggest new features, or report issues.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSc5pN1L_9S5u4y7v6wF8y2Z3x1C9vK4mL6nB0pQ8rT1uV2w/viewform?embedded=true"
            width="100%"
            height="600"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="w-full"
          >
            Loading…
          </iframe>
        </motion.div>
      </div>
    </div>
  );
}