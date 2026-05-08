import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?base=AUD", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Upstream API error");

    const json = await res.json();
    return NextResponse.json({
      rates: json.rates as Record<string, number>,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      rates: FALLBACK_RATES,
      updatedAt: new Date().toISOString(),
    });
  }
}
