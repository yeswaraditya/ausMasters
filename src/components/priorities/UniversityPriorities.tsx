"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, University, Building2, Info, AlertCircle, CheckCircle, Clock, Search } from "lucide-react";

const OVERALL_PROGRESS = {
  higherEducation: {
    indicative: 196200,
    currentFuture: 136600,
    withVisa: 120900,
    nosc: 90900,
  },
  vocational: {
    indicative: 94300,
    currentFuture: 54300,
    withVisa: 49600,
    nosc: 35700,
  },
  total: {
    indicative: 295000,
    currentFuture: 190900,
    withVisa: 170500,
    nosc: 126600,
  },
};

const PUBLIC_UNIVERSITIES = [
  { cricos: "04249J", name: "Adelaide University", allocation: 7350, status: "Priority 1" },
  { cricos: "00004G", name: "Australian Catholic University Limited", allocation: 1900, status: "Priority 1" },
  { cricos: "00120C", name: "Australian National University", allocation: 3750, status: "Priority 1" },
  { cricos: "00219C", name: "Central Queensland University", allocation: 3170, status: "Priority 1" },
  { cricos: "00300K", name: "Charles Darwin University (CDU)", allocation: 2740, status: "Priority 1*" },
  { cricos: "00005F", name: "Charles Sturt University (CSU)", allocation: 1775, status: "Priority 1" },
  { cricos: "00301J", name: "Curtin University", allocation: 4100, status: "Priority 1" },
  { cricos: "00113B", name: "Deakin University (Deakin)", allocation: 6300, status: "Priority 1" },
  { cricos: "00279B", name: "Edith Cowan University", allocation: 3700, status: "Priority 1" },
  { cricos: "00103D", name: "Federation University Australia", allocation: 1800, status: "Priority 1" },
  { cricos: "00114A", name: "Flinders University", allocation: 3000, status: "Priority 1" },
  { cricos: "00233E", name: "Griffith University", allocation: 3800, status: "Priority 1" },
  { cricos: "00117J", name: "James Cook University", allocation: 2200, status: "Priority 1" },
  { cricos: "00115M", name: "La Trobe University (La Trobe)", allocation: 4700, status: "Priority 1" },
  { cricos: "00002J", name: "Macquarie University (Macquarie)", allocation: 5250, status: "Priority 1" },
  { cricos: "00008C", name: "Monash University (Monash)", allocation: 11910, status: "Priority 1" },
  { cricos: "00125J", name: "Murdoch University (Murdoch)", allocation: 3900, status: "Priority 1" },
  { cricos: "00213J", name: "Queensland University of Technology (QUT)", allocation: 4750, status: "Priority 1" },
  { cricos: "00122A", name: "Royal Melbourne Institute of Technology", allocation: 8199, status: "Priority 1" },
  { cricos: "01241G", name: "Southern Cross University (SCU)", allocation: 1500, status: "Priority 1" },
  { cricos: "00111D", name: "Swinburne University of Technology", allocation: 4523, status: "Priority 1" },
  { cricos: "00116K", name: "The University of Melbourne (UniMelb)", allocation: 10500, status: "Priority 2" },
  { cricos: "00098G", name: "The University of New South Wales (UNSW)", allocation: 10350, status: "Priority 1" },
  { cricos: "00109J", name: "The University of Newcastle (UoN)", allocation: 2425, status: "Priority 1" },
  { cricos: "01032F", name: "The University of Notre Dame Australia", allocation: 800, status: "Priority 1" },
  { cricos: "00025B", name: "The University of Queensland", allocation: 8050, status: "Priority 1" },
  { cricos: "00026A", name: "The University of Sydney", allocation: 11900, status: "Priority 2" },
  { cricos: "00126G", name: "The University of Western Australia (UWA)", allocation: 3550, status: "Priority 1" },
  { cricos: "00212K", name: "University of Canberra", allocation: 1800, status: "Priority 1" },
  { cricos: "00003G", name: "University of New England", allocation: 700, status: "Priority 1" },
  { cricos: "00244B", name: "University of Southern Queensland", allocation: 1000, status: "Priority 1" },
  { cricos: "02225M", name: "University of Southern Queensland", allocation: 50, status: "Priority 1" },
  { cricos: "00586B", name: "University of Tasmania (UTas)", allocation: 2250, status: "Priority 1" },
  { cricos: "00099F", name: "University of Technology Sydney (UTS)", allocation: 5050, status: "Priority 1" },
  { cricos: "01595D", name: "University of the Sunshine Coast", allocation: 1675, status: "Priority 1" },
  { cricos: "00102E", name: "University of Wollongong (UoW)", allocation: 3550, status: "Priority 1" },
  { cricos: "00124K", name: "Victoria University", allocation: 2689, status: "Priority 1" },
  { cricos: "02475D", name: "Victoria University", allocation: 1418, status: "Priority 1" },
  { cricos: "00917K", name: "Western Sydney University", allocation: 4000, status: "Priority 1" },
];

const TAFE_PROVIDERS = [
  { cricos: "02411J", name: "Box Hill Institute", allocation: 128, status: "Priority 1" },
  { cricos: "00881F", name: "Chisholm Institute", allocation: 80, status: "Priority 1" },
  { cricos: "00012G", name: "Holmesglen Institute", allocation: 389, status: "Priority 1" },
  { cricos: "00724G", name: "Melbourne Polytechnic", allocation: 446, status: "Priority 1" },
  { cricos: "03020E", name: "TAFE Queensland", allocation: 1423, status: "Priority 1" },
  { cricos: "00092B", name: "TAFE SA", allocation: 358, status: "Priority 1" },
  { cricos: "00591E", name: "Technical and Further Education Commission", allocation: 1461, status: "Priority 1" },
  { cricos: "01505M", name: "William Angliss Institute of TAFE", allocation: 534, status: "Priority 1" },
];

const OTHER_PROVIDERS = [
  { cricos: "02439G", name: "Academies Australasia Polytechnic Pty Limited", allocation: 200, status: "Priority 3" },
  { cricos: "02155J", name: "Academy of Interactive Technology", allocation: 125, status: "Priority 1" },
  { cricos: "01328A", name: "ACAP University College", allocation: 310, status: "Priority 3" },
  { cricos: "00197D", name: "Acknowledge Education Pty Ltd", allocation: 2140, status: "Priority 2" },
  { cricos: "01822J", name: "ACPE Limited", allocation: 50, status: "Priority 1" },
  { cricos: "03763K", name: "Adelaide Institute of Higher Education Pty Ltd", allocation: 55, status: "Priority 3" },
  { cricos: "03986F", name: "AIE Institute Limited", allocation: 50, status: "Priority 1" },
  { cricos: "04059D", name: "Analytics Institute of Australia Pty Ltd", allocation: 50, status: "Priority 2" },
  { cricos: "03967J", name: "Apex Institute of Higher Education Pty Ltd", allocation: 165, status: "Priority 1" },
  { cricos: "03048D", name: "Asia Pacific International College Pty Ltd", allocation: 495, status: "Priority 3" },
  { cricos: "04231H", name: "Astra Institute of Higher Education", allocation: 50, status: "Priority 3" },
  { cricos: "04181B", name: "Australasian Academy of Higher Education", allocation: 145, status: "Priority 1" },
  { cricos: "03836J", name: "Australia Advance Education Group Pty Ltd", allocation: 445, status: "Priority 2" },
  { cricos: "01108B", name: "Australian Academy of Music and Performing Arts", allocation: 50, status: "Priority 1" },
  { cricos: "03809A", name: "Australian Campus Management Pty Ltd", allocation: 610, status: "Priority 3" },
  { cricos: "00197D", name: "Australian Institute of Business and Management Pty Ltd", allocation: 1165, status: "Priority 3" },
  { cricos: "00197D", name: "Australian Institute of Business Intelligence Pty Ltd", allocation: 165, status: "Priority 3" },
  { cricos: "00197D", name: "Australian Institute of Higher Education Pty Ltd", allocation: 555, status: "Priority 3" },
  { cricos: "00197D", name: "Australian Institute of Technology and Commerce Pty Ltd", allocation: 55, status: "Priority 1" },
  { cricos: "00197D", name: "Australian School of Accounting Pty Ltd", allocation: 195, status: "Priority 2" },
  { cricos: "00017B", name: "Bond University", allocation: 800, status: "Priority 1" },
  { cricos: "02015K", name: "Edith Cowan College Pty Ltd", allocation: 515, status: "Priority 1" },
  { cricos: "02738G", name: "Educational Enterprises Australia Pty Ltd", allocation: 355, status: "Priority 1" },
  { cricos: "01016F", name: "Excelsia University College", allocation: 525, status: "Priority 3" },
  { cricos: "01718J", name: "Kaplan Business School Pty Ltd", allocation: 3265, status: "Priority 1" },
  { cricos: "02042G", name: "Kent Institute Australia Pty Ltd", allocation: 361, status: "Priority 2" },
  { cricos: "03744B", name: "Le Cordon Bleu Australia Pty Limited", allocation: 441, status: "Priority 1" },
  { cricos: "04122B", name: "Leaders Institute Pty Ltd", allocation: 55, status: "Priority 3" },
  { cricos: "03932J", name: "Lincoln Institute of Higher Education Ltd", allocation: 65, status: "Priority 3" },
  { cricos: "01312J", name: "Melbourne Institute of Business & Technology Pty Ltd", allocation: 880, status: "Priority 1" },
  { cricos: "04342A", name: "Melbourne Institute of Higher Education Pty Ltd", allocation: 50, status: "Priority 2" },
  { cricos: "00561M", name: "Melbourne Institute of Technology Pty Ltd", allocation: 705, status: "Priority 1" },
  { cricos: "03879J", name: "Monash College Pty Ltd", allocation: 100, status: "Priority 1" },
  { cricos: "03390A", name: "Navitas Bundoora Pty Ltd", allocation: 595, status: "Priority 1" },
  { cricos: "03567C", name: "Queensland Institute of Business and Technology Pty Ltd", allocation: 510, status: "Priority 1" },
  { cricos: "02804C", name: "Queensland Institute of Higher Education Pty Ltd", allocation: 75, status: "Priority 2" },
  { cricos: "02664K", name: "SAE Institute Pty Ltd", allocation: 135, status: "Priority 1" },
  { cricos: "04218E", name: "Southern Cross Education Institute (Higher Education) Pty Ltd", allocation: 390, status: "Priority 1" },
  { cricos: "02571D", name: "SP Jain School of Global Management Pty Ltd", allocation: 280, status: "Priority 1" },
  { cricos: "03845H", name: "Stanley International College Pty Ltd", allocation: 1345, status: "Priority 2" },
  { cricos: "02727M", name: "Sydney Institute of Business and Technology Pty Ltd", allocation: 85, status: "Priority 1" },
  { cricos: "02767C", name: "Sydney Institute of Higher Education Pty Ltd", allocation: 225, status: "Priority 1" },
  { cricos: "02639M", name: "Sydney Metropolitan Institute of Technology Pty Ltd", allocation: 245, status: "Priority 2" },
  { cricos: "02914G", name: "Torrens University Australia Limited", allocation: 2885, status: "Priority 1" },
  { cricos: "04229B", name: "University of Divinity", allocation: 50, status: "Priority 1" },
  { cricos: "03407G", name: "UNSW Global Pty Limited", allocation: 525, status: "Priority 3" },
  { cricos: "01484M", name: "UOWC Ltd", allocation: 315, status: "Priority 1" },
  { cricos: "04391C", name: "UTS College Limited", allocation: 815, status: "Priority 1" },
  { cricos: "00017B", name: "Victorian Institute of Technology Pty Ltd", allocation: 1261, status: "Priority 2" },
  { cricos: "02015K", name: "Wentworth Institute of Higher Education Pty Ltd", allocation: 465, status: "Priority 1" },
];

function getStatusColor(status: string) {
  if (status.includes("Priority 1")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status.includes("Priority 2")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (status.includes("Priority 3")) return "bg-red-100 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function UniversityPriorities() {
  const [activeTab, setActiveTab] = useState<"universities" | "tafe" | "other">("universities");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return PUBLIC_UNIVERSITIES;
    const query = searchQuery.toLowerCase();
    return PUBLIC_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.cricos.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredTAFE = useMemo(() => {
    if (!searchQuery.trim()) return TAFE_PROVIDERS;
    const query = searchQuery.toLowerCase();
    return TAFE_PROVIDERS.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.cricos.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredOther = useMemo(() => {
    if (!searchQuery.trim()) return OTHER_PROVIDERS;
    const query = searchQuery.toLowerCase();
    return OTHER_PROVIDERS.filter(
      (o) =>
        o.name.toLowerCase().includes(query) ||
        o.cricos.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const currentData = activeTab === "universities" ? filteredUniversities : activeTab === "tafe" ? filteredTAFE : filteredOther;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                University Priorities List
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Provider Allocation Status for Student Visa Processing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Latest Report:</strong> Data from Provider Registration and International Student Management System (PRISMS) as at <strong>1 May 2026</strong>. This report is expected to be updated weekly and is subject to change based on ongoing allocations.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress - 2026</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Higher Education</p>
              <p className="text-2xl font-bold text-blue-700">{Math.round((OVERALL_PROGRESS.higherEducation.nosc / OVERALL_PROGRESS.higherEducation.indicative) * 100)}%</p>
              <p className="text-xs text-gray-500">{OVERALL_PROGRESS.higherEducation.nosc.toLocaleString()} / {OVERALL_PROGRESS.higherEducation.indicative.toLocaleString()} NOSCs</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Vocational Education & Training</p>
              <p className="text-2xl font-bold text-emerald-700">{Math.round((OVERALL_PROGRESS.vocational.nosc / OVERALL_PROGRESS.vocational.indicative) * 100)}%</p>
              <p className="text-xs text-gray-500">{OVERALL_PROGRESS.vocational.nosc.toLocaleString()} / {OVERALL_PROGRESS.vocational.indicative.toLocaleString()} NOSCs</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-purple-700">{Math.round((OVERALL_PROGRESS.total.nosc / OVERALL_PROGRESS.total.indicative) * 100)}%</p>
              <p className="text-xs text-gray-500">{OVERALL_PROGRESS.total.nosc.toLocaleString()} / {OVERALL_PROGRESS.total.indicative.toLocaleString()} NOSCs</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveTab("universities")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "universities"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <University className="w-4 h-4" />
                Public Universities ({PUBLIC_UNIVERSITIES.length})
              </button>
              <button
                onClick={() => setActiveTab("tafe")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "tafe"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
<Building2 className="w-4 h-4" />
                TAFE Providers ({TAFE_PROVIDERS.length})
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "other"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Other Providers ({OTHER_PROVIDERS.length})
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or CRICOS code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">CRICOS</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider Name</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Indicative Allocation</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.map((provider) => (
                  <tr key={provider.cricos} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{provider.cricos}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{provider.name}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{provider.allocation.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No providers found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <h3 className="text-lg font-semibold text-gray-900">Understanding Priority Levels</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-800">Priority 1</span>
              </div>
              <p className="text-sm text-emerald-700">
                Provider has not reached 80% of their indicative allocation. Fastest processing time.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-800">Priority 2</span>
              </div>
              <p className="text-sm text-amber-700">
                Provider is between 80% and 115% of their indicative allocation. Standard processing time.
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-800">Priority 3</span>
              </div>
              <p className="text-sm text-red-700">
                Provider has exceeded 115% of their indicative allocation. Longer processing time expected.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Note: Priority status does not affect visa outcomes. All applications are considered by relevant delegated officers regardless of priority level. Priority levels only affect processing time for offshore student visa applications.
          </p>
        </motion.div>
      </div>
    </div>
  );
}