"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  CheckSquare,
  PenTool,
  Globe,
  ArrowRight,
  User,
  Mail,
  Calendar,
} from "lucide-react";

interface Activity {
  id: string;
  type: "chat" | "gs" | "checklist" | "sop";
  title: string;
  date: string;
  status: "completed" | "in-progress";
}

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "chat",
    title: "Visa Profile Assessment",
    date: "2026-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "gs",
    title: "GS Questionnaire - Draft",
    date: "2026-01-14",
    status: "in-progress",
  },
  {
    id: "3",
    type: "checklist",
    title: "Visa Application Checklist",
    date: "2026-01-13",
    status: "in-progress",
  },
];

export default function DashboardClient() {
  const [activities] = useState<Activity[]>(recentActivities);

  const quickLinks = [
    {
      href: "/gs-questionnaire",
      icon: FileText,
      title: "GS Questionnaire",
      description: "Complete your Genuine Student form",
      color: "from-emerald-500 to-teal-500",
    },
    {
      href: "/checklist",
      icon: CheckSquare,
      title: "Visa Checklist",
      description: "Track your application documents",
      color: "from-amber-500 to-orange-500",
    },
    {
      href: "/sop-helper",
      icon: PenTool,
      title: "SOP Helper",
      description: "Write your Statement of Purpose",
      color: "from-purple-500 to-pink-500",
    },
    {
      href: "/country-compare",
      icon: Globe,
      title: "Compare Countries",
      description: "Study destinations side by side",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome to ausMasters
            </h1>
            <p className="text-gray-600">
              Manage your study abroad journey from one place
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Access
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {link.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y">
                {activities.map((activity) => {
                  const iconMap = {
                    chat: MessageSquare,
                    gs: FileText,
                    checklist: CheckSquare,
                    sop: PenTool,
                  };
                  const Icon = iconMap[activity.type];

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(activity.date).toLocaleDateString(
                              "en-AU",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {activity.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Your Profile
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Guest User
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Not signed in
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Australia Student Visa
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white"
            >
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/90 mb-4">
                Complete your GS Questionnaire to start your application.
              </p>
              <Link
                href="/gs-questionnaire"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
              >
                GS Questionnaire
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
