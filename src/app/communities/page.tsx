"use client";

import { motion } from "framer-motion";
import { Users, MessageCircle, ArrowRight } from "lucide-react";

export default function Communities() {
  const groups = [
    {
      name: "General Discussion",
      description: "Connect with fellow students, share experiences, and ask questions",
      icon: Users,
      status: "Available",
    },
    {
      name: "University Updates",
      description: "Get latest information about university admissions and deadlines",
      icon: MessageCircle,
      status: "Available",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Communities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join WhatsApp groups to connect with other Australian student visa applicants, share experiences, and get real-time updates.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {groups.map((group, i) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {group.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {group.description}
                </p>
                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group"
                >
                  Join Group
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center"
        >
          <p className="text-sm text-blue-900 mb-4">
            Don't see a group for your interests? Let us know in the feedback form and we'll create one!
          </p>
          <a
            href="https://forms.gle/trzo4toSxzsddirr9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Send Feedback
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}