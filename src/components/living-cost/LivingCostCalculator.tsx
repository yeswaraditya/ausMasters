"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Home,
  ShoppingCart,
  Zap,
  Navigation,
  Laugh,
  Download,
  TrendingUp,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type City = "Sydney" | "Melbourne" | "Brisbane" | "Perth" | "Adelaide" | "Canberra" | "Hobart" | "Darwin";
type Tier = "Backpacker" | "Student" | "Comfortable" | "Premium";
type Category = "housing" | "food" | "transport" | "entertainment" | "utilities";
type ActiveTab = "calculator" | "comparison";

interface CityRange {
  min: number;
  max: number;
}

interface CityCosts {
  housing: CityRange;
  food: CityRange;
  transport: CityRange;
  entertainment: CityRange;
  utilities: CityRange;
}

interface BudgetValues {
  housing: number;
  food: number;
  transport: number;
  entertainment: number;
  utilities: number;
}

interface RatesResponse {
  rates: Record<string, number>;
  updatedAt: string;
}

interface CountryOption {
  name: string;
  code: string;
  currency: string;
  flag: string;
}

interface CategoryMeta {
  key: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CITY_COSTS: Record<City, CityCosts> = {
  Sydney: {
    housing: { min: 1800, max: 3200 },
    food: { min: 500, max: 900 },
    transport: { min: 180, max: 220 },
    entertainment: { min: 200, max: 400 },
    utilities: { min: 150, max: 200 },
  },
  Melbourne: {
    housing: { min: 1600, max: 2800 },
    food: { min: 450, max: 800 },
    transport: { min: 180, max: 220 },
    entertainment: { min: 180, max: 350 },
    utilities: { min: 140, max: 180 },
  },
  Brisbane: {
    housing: { min: 1400, max: 2400 },
    food: { min: 400, max: 750 },
    transport: { min: 160, max: 200 },
    entertainment: { min: 150, max: 300 },
    utilities: { min: 130, max: 170 },
  },
  Perth: {
    housing: { min: 1300, max: 2200 },
    food: { min: 380, max: 700 },
    transport: { min: 150, max: 190 },
    entertainment: { min: 140, max: 280 },
    utilities: { min: 120, max: 160 },
  },
  Adelaide: {
    housing: { min: 1100, max: 1800 },
    food: { min: 350, max: 650 },
    transport: { min: 140, max: 180 },
    entertainment: { min: 120, max: 250 },
    utilities: { min: 110, max: 150 },
  },
  Canberra: {
    housing: { min: 1500, max: 2600 },
    food: { min: 420, max: 750 },
    transport: { min: 160, max: 200 },
    entertainment: { min: 150, max: 280 },
    utilities: { min: 140, max: 180 },
  },
  Hobart: {
    housing: { min: 1200, max: 2000 },
    food: { min: 380, max: 650 },
    transport: { min: 140, max: 170 },
    entertainment: { min: 120, max: 230 },
    utilities: { min: 130, max: 170 },
  },
  Darwin: {
    housing: { min: 1400, max: 2400 },
    food: { min: 450, max: 750 },
    transport: { min: 160, max: 200 },
    entertainment: { min: 150, max: 280 },
    utilities: { min: 180, max: 250 },
  },
};

const TIER_MULTIPLIERS: Record<Tier, number> = {
  Backpacker: 0,
  Student: 0.33,
  Comfortable: 0.67,
  Premium: 1,
};

const COUNTRIES: CountryOption[] = [
  { name: "India", code: "IN", currency: "INR", flag: "🇮🇳" },
  { name: "China", code: "CN", currency: "CNY", flag: "🇨🇳" },
  { name: "USA", code: "US", currency: "USD", flag: "🇺🇸" },
  { name: "UK", code: "GB", currency: "GBP", flag: "🇬🇧" },
  { name: "Nepal", code: "NP", currency: "NPR", flag: "🇳🇵" },
  { name: "Pakistan", code: "PK", currency: "PKR", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", currency: "BDT", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "LK", currency: "LKR", flag: "🇱🇰" },
  { name: "Philippines", code: "PH", currency: "PHP", flag: "🇵🇭" },
  { name: "Indonesia", code: "ID", currency: "IDR", flag: "🇮🇩" },
  { name: "Vietnam", code: "VN", currency: "VND", flag: "🇻🇳" },
  { name: "Malaysia", code: "MY", currency: "MYR", flag: "🇲🇾" },
  { name: "Singapore", code: "SG", currency: "SGD", flag: "🇸🇬" },
  { name: "South Korea", code: "KR", currency: "KRW", flag: "🇰🇷" },
  { name: "Japan", code: "JP", currency: "JPY", flag: "🇯🇵" },
  { name: "Brazil", code: "BR", currency: "BRL", flag: "🇧🇷" },
  { name: "Nigeria", code: "NG", currency: "NGN", flag: "🇳🇬" },
  { name: "Canada", code: "CA", currency: "CAD", flag: "🇨🇦" },
  { name: "Germany", code: "DE", currency: "EUR", flag: "🇩🇪" },
  { name: "UAE", code: "AE", currency: "AED", flag: "🇦🇪" },
];

const TREND_BADGES: Record<Category, string> = {
  housing: "+6.1% YoY",
  food: "+5.2% YoY",
  transport: "+3.8% YoY",
  entertainment: "+2.9% YoY",
  utilities: "+4.5% YoY",
};

const LIFESTYLE_SCORE_BASE: Record<City, number> = {
  Sydney: 75,
  Melbourne: 80,
  Brisbane: 72,
  Perth: 68,
  Adelaide: 70,
  Canberra: 76,
  Hobart: 65,
  Darwin: 60,
};

const CATEGORY_META: CategoryMeta[] = [
  { key: "housing", label: "Housing", icon: Home, color: "from-blue-500 to-blue-600" },
  { key: "food", label: "Food & Groceries", icon: ShoppingCart, color: "from-emerald-500 to-emerald-600" },
  { key: "transport", label: "Transport", icon: Navigation, color: "from-orange-500 to-orange-600" },
  { key: "entertainment", label: "Entertainment", icon: Laugh, color: "from-pink-500 to-pink-600" },
  { key: "utilities", label: "Utilities", icon: Zap, color: "from-yellow-500 to-yellow-600" },
];

const FALLBACK_RATES: Record<string, number> = {
  INR: 54.2,
  CNY: 4.7,
  USD: 0.64,
  GBP: 0.51,
  NPR: 86.7,
  PKR: 177.4,
  BDT: 70.1,
  LKR: 195.3,
  PHP: 36.2,
  IDR: 10142,
  VND: 16234,
  MYR: 2.97,
  SGD: 0.86,
  KRW: 847,
  JPY: 95.4,
  BRL: 3.21,
  NGN: 1040,
  CAD: 0.88,
  EUR: 0.59,
  AED: 2.36,
};

// ============================================================================
// SVG ARC HELPERS
// ============================================================================

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  if (endAngle <= startAngle) {
    endAngle = startAngle + 0.001;
  }
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

// ============================================================================
// HELPERS
// ============================================================================

function getDefaultValues(city: City, tier: Tier): BudgetValues {
  const cityData = CITY_COSTS[city];
  const multiplier = TIER_MULTIPLIERS[tier];
  return {
    housing: Math.round(cityData.housing.min + (cityData.housing.max - cityData.housing.min) * multiplier),
    food: Math.round(cityData.food.min + (cityData.food.max - cityData.food.min) * multiplier),
    transport: Math.round(cityData.transport.min + (cityData.transport.max - cityData.transport.min) * multiplier),
    entertainment: Math.round(cityData.entertainment.min + (cityData.entertainment.max - cityData.entertainment.min) * multiplier),
    utilities: Math.round(cityData.utilities.min + (cityData.utilities.max - cityData.utilities.min) * multiplier),
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LivingCostCalculator() {
  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>("calculator");
  const [selectedCity, setSelectedCity] = useState<City>("Sydney");
  const [selectedTier, setSelectedTier] = useState<Tier>("Student");
  const [budget, setBudget] = useState<BudgetValues>(() => getDefaultValues("Sydney", "Student"));
  const [savingsInput, setSavingsInput] = useState<string>("");
  const [homeCurrency, setHomeCurrency] = useState<string>("INR");
  const [convertAmount, setConvertAmount] = useState<string>("");
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [comparisonCities, setComparisonCities] = useState<City[]>(["Sydney", "Melbourne", "Brisbane"]);

  // Derived values
  const totalMonthly = useMemo(() => {
    return Object.values(budget).reduce((sum, val) => sum + val, 0);
  }, [budget]);

  const gaugePercent = useMemo(() => {
    return Math.min(totalMonthly / 3500, 1.5);
  }, [totalMonthly]);

  const lifestyleScore = useMemo(() => {
    const base = LIFESTYLE_SCORE_BASE[selectedCity];
    const adjusted = base - Math.floor((totalMonthly - 2000) / 200);
    return Math.max(0, Math.min(100, adjusted));
  }, [selectedCity, totalMonthly]);

  const monthsSurvivable = useMemo(() => {
    if (!savingsInput || totalMonthly === 0) return null;
    return Math.floor(Number(savingsInput) / totalMonthly);
  }, [savingsInput, totalMonthly]);

  const convertedAmount = useMemo(() => {
    if (!convertAmount || !rates) return null;
    const effectiveRate = rates.rates[homeCurrency] ?? FALLBACK_RATES[homeCurrency];
    if (!effectiveRate) return null;
    return Number(convertAmount) / effectiveRate;
  }, [convertAmount, rates, homeCurrency]);

  const gaugeColor = useMemo(() => {
    if (gaugePercent < 0.75) return "emerald";
    if (gaugePercent < 1.0) return "amber";
    return "red";
  }, [gaugePercent]);

  const gaugeColorClass = {
    emerald: "text-emerald-600 fill-emerald-600 stroke-emerald-600",
    amber: "text-amber-600 fill-amber-600 stroke-amber-600",
    red: "text-red-600 fill-red-600 stroke-red-600",
  }[gaugeColor];

  // Fetch rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const res = await fetch("/api/living-costs");
        const data = (await res.json()) as RatesResponse;
        setRates(data);
      } catch {
        setRates({
          rates: FALLBACK_RATES,
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
  }, []);

  // Reset budget when city or tier changes
  useEffect(() => {
    setBudget(getDefaultValues(selectedCity, selectedTier));
  }, [selectedCity, selectedTier]);

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Living Cost Report - Australia", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`City: ${selectedCity}  |  Lifestyle: ${selectedTier}`, 105, 30, { align: "center" });
    doc.text(`Generated: ${new Date().toLocaleDateString("en-AU")}`, 105, 38, { align: "center" });

    autoTable(doc, {
      startY: 50,
      head: [["Category", "Monthly (AUD)", "Annual (AUD)", "% of Total"]],
      body: CATEGORY_META.map(({ key, label }) => [
        label,
        `$${formatNumber(budget[key])}`,
        `$${formatNumber(budget[key] * 12)}`,
        `${Math.round((budget[key] / totalMonthly) * 100)}%`,
      ]),
      foot: [["Total", `$${formatNumber(totalMonthly)}`, `$${formatNumber(totalMonthly * 12)}`, "100%"]],
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      footStyles: { fillColor: [241, 245, 249], textColor: [30, 30, 30], fontStyle: "bold" },
      margin: { left: 20, right: 20 },
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Lifestyle Score: ${lifestyleScore}/100`, 20, finalY + 15);
    if (savingsInput) {
      doc.text(`Savings Runway: ${monthsSurvivable} months (AUD $${formatNumber(Number(savingsInput))})`, 20, finalY + 25);
    }
    doc.save(`living-cost-${selectedCity.toLowerCase()}.pdf`);
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Living Cost Calculator</h1>
              <p className="text-gray-600 mt-1">Estimate your monthly expenses across Australian cities</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {(["calculator", "comparison"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {tab === "calculator" ? "Calculator" : "City Comparison"}
            </button>
          ))}
        </motion.div>

        {/* CALCULATOR TAB */}
        <AnimatePresence mode="wait">
          {activeTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* City & Tier Selectors */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Cities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select City</h3>
                    <div className="flex flex-wrap gap-2">
                      {(["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Hobart", "Darwin"] as City[]).map((city) => (
                        <button
                          key={city}
                          onClick={() => setSelectedCity(city)}
                          className={cn(
                            "px-4 py-2 rounded-full font-medium text-sm transition-all",
                            selectedCity === city
                              ? "bg-blue-600 text-white shadow-md"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tiers */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Tier</h3>
                    <div className="flex flex-wrap gap-2">
                      {(["Backpacker", "Student", "Comfortable", "Premium"] as Tier[]).map((tier) => {
                        const tierColors: Record<Tier, string> = {
                          Backpacker: "from-slate-500 to-slate-600",
                          Student: "from-blue-500 to-blue-600",
                          Comfortable: "from-emerald-500 to-emerald-600",
                          Premium: "from-violet-500 to-violet-600",
                        };
                        return (
                          <button
                            key={tier}
                            onClick={() => setSelectedTier(tier)}
                            className={cn(
                              "px-4 py-2 rounded-full font-medium text-sm transition-all",
                              selectedTier === tier
                                ? `bg-gradient-to-r ${tierColors[tier]} text-white shadow-md`
                                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main 2-Col Grid */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Left: Sliders */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-8">Monthly Budget Breakdown</h3>
                  <div className="space-y-8">
                    {CATEGORY_META.map(({ key, label, icon: Icon, color }, idx) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 + idx * 0.05 }}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", color)}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900">{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">
                              {TREND_BADGES[key]}
                            </span>
                            <span className="text-sm font-bold text-gray-900">AUD ${formatNumber(budget[key])}</span>
                          </div>
                        </div>

                        {/* Slider */}
                        <input
                          type="range"
                          min={CITY_COSTS[selectedCity][key].min}
                          max={CITY_COSTS[selectedCity][key].max}
                          step={10}
                          value={budget[key]}
                          onChange={(e) => setBudget({ ...budget, [key]: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />

                        {/* Min/Max */}
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                          <span>Min: ${formatNumber(CITY_COSTS[selectedCity][key].min)}</span>
                          <span>Max: ${formatNumber(CITY_COSTS[selectedCity][key].max)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right: Gauge + Score + Savings */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Budget Gauge */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Budget Status</h3>
                    <div className="flex justify-center mb-6">
                      <svg viewBox="0 0 200 110" className="w-full max-w-xs">
                        {/* Background arc */}
                        <path
                          d={describeArc(100, 100, 80, 180, 360)}
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                        />
                        {/* Foreground arc */}
                        <motion.path
                          d={describeArc(100, 100, 80, 180, 180 + Math.max(0, gaugePercent) * 180)}
                          stroke={gaugeColor === "emerald" ? "#10b981" : gaugeColor === "amber" ? "#f59e0b" : "#ef4444"}
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          animate={{
                            d: describeArc(100, 100, 80, 180, 180 + Math.max(0, gaugePercent) * 180),
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-blue-600 mb-2">AUD ${formatNumber(totalMonthly)}</div>
                      <div className="text-sm text-gray-600">/month</div>
                      <div
                        className={cn(
                          "text-sm font-semibold mt-3 px-3 py-1 rounded-full inline-block",
                          gaugePercent < 0.75
                            ? "bg-emerald-100 text-emerald-700"
                            : gaugePercent < 1.0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {gaugePercent < 0.75 ? "Surplus ✓" : gaugePercent < 1.0 ? "Tight Budget" : "Over Budget"}
                      </div>
                    </div>
                  </motion.div>

                  {/* Savings Runway */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Runway</h3>
                    <input
                      type="number"
                      placeholder="Enter savings (AUD)"
                      value={savingsInput}
                      onChange={(e) => setSavingsInput(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                    />
                    {monthsSurvivable !== null && (
                      <motion.div
                        key={monthsSurvivable}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-center"
                      >
                        <div className="text-4xl font-black text-blue-600">{monthsSurvivable}</div>
                        <div className="text-sm text-gray-600">months</div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Lifestyle Score */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full">
                          <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#2563eb"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${251.2 * (lifestyleScore / 100)} 251.2`}
                            animate={{ strokeDasharray: [`${251.2 * (lifestyleScore / 100)} 251.2`] }}
                            transition={{ duration: 0.6 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-black text-lg text-blue-600">{lifestyleScore}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {lifestyleScore >= 70
                          ? "Great quality of life"
                          : lifestyleScore >= 50
                          ? "Balanced lifestyle"
                          : "High cost pressure"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Currency Converter */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Currency Converter</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Country Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Country</label>
                    <select
                      value={homeCurrency}
                      onChange={(e) => setHomeCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.currency} value={country.currency}>
                          {country.flag} {country.name} ({country.currency})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount in {homeCurrency}</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Result */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equivalent in AUD</label>
                    <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                      {ratesLoading ? (
                        <span className="text-gray-500 text-sm">Loading rates...</span>
                      ) : convertedAmount !== null ? (
                        <span className="font-semibold text-gray-900">AUD ${formatNumber(convertedAmount)}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </div>
                </div>
                {rates && (
                  <p className="text-xs text-gray-400 mt-4">
                    Rates updated: {new Date(rates.updatedAt).toLocaleDateString("en-AU")}
                  </p>
                )}
              </motion.div>

              {/* Export Button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-end"
              >
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPARISON TAB */}
        <AnimatePresence mode="wait">
          {activeTab === "comparison" && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* City Selection */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Select Cities to Compare</h3>
                  <span className="text-sm text-gray-500">
                    {comparisonCities.length}/3 selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Hobart", "Darwin"] as City[]).map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        if (comparisonCities.includes(city)) {
                          setComparisonCities(comparisonCities.filter((c) => c !== city));
                        } else if (comparisonCities.length < 3) {
                          setComparisonCities([...comparisonCities, city]);
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full font-medium text-sm transition-all",
                        comparisonCities.includes(city)
                          ? "bg-blue-600 text-white shadow-md"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Tier Selector */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Tier</h3>
                <div className="flex flex-wrap gap-2">
                  {(["Backpacker", "Student", "Comfortable", "Premium"] as Tier[]).map((tier) => {
                    const tierColors: Record<Tier, string> = {
                      Backpacker: "from-slate-500 to-slate-600",
                      Student: "from-blue-500 to-blue-600",
                      Comfortable: "from-emerald-500 to-emerald-600",
                      Premium: "from-violet-500 to-violet-600",
                    };
                    return (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={cn(
                          "px-4 py-2 rounded-full font-medium text-sm transition-all",
                          selectedTier === tier
                            ? `bg-gradient-to-r ${tierColors[tier]} text-white shadow-md`
                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Comparison Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${comparisonCities.length}, 1fr)`,
                  gap: "1.5rem",
                }}
              >
                {comparisonCities.map((city, idx) => {
                  const cityBudget = getDefaultValues(city, selectedTier);
                  const cityTotal = Object.values(cityBudget).reduce((sum, val) => sum + val, 0);
                  return (
                    <motion.div
                      key={city}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                      {/* City Header */}
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">{city}</h3>
                        <p className="text-sm text-gray-600">Total: AUD ${formatNumber(cityTotal)}/mo</p>
                      </div>

                      {/* Categories */}
                      <div className="space-y-4">
                        {CATEGORY_META.map(({ key, label, icon: Icon, color }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", color)}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{label}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">AUD ${formatNumber(cityBudget[key])}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Monthly Total</span>
                          <span className="text-lg font-black text-blue-600">AUD ${formatNumber(cityTotal)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
