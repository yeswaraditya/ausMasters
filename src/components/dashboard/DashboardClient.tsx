"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== "undefined") {
      const savedActivities = localStorage.getItem("dashboard-activities");
      if (savedActivities) {
        return JSON.parse(savedActivities);
      }
    }
    return recentActivities;
  });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const quickLinks = [
    {
      href: "/chat",
      icon: MessageSquare,
      title: "Visa Chat",
      description: "Get AI-powered visa profile assessment",
      color: "from-blue-500 to-cyan-500",
    },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.name || "Student"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your study abroad journey from one place
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Access
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y dark:divide-gray-800">
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
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
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
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Your Profile
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.name || "Not signed in"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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
                Start a visa profile chat to get personalized guidance for your
                application.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Start Chat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
