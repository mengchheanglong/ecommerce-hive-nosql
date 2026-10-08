"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Store,
  ChevronDown,
  MessageSquare,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "payments" | "delivery" | "returns" | "orders" | "merchants";
}

const FAQ_DATA: FAQItem[] = [
  // Payments
  {
    category: "payments",
    question: "How do I pay using NBC Bakong KHQR?",
    answer:
      "When checking out, select 'NBC Bakong KHQR'. A dynamic KHQR code with an exact countdown timer will be generated. Open any Cambodian mobile banking app (ABA Mobile, Acleda toanChes, Wing Bank, Canadia, TrueMoney, or Bakong App), scan the QR code, and confirm. Settlement is instantaneous with $0 transaction fee.",
  },
  {
    category: "payments",
    question: "Can I pay in Cambodian Riel (៛ KHR) or US Dollars ($ USD)?",
    answer:
      "Yes! You can toggle between USD ($) and KHR (៛) in the top header at any time. Rentify automatically converts catalog prices using the official National Bank of Cambodia benchmark rate (1 USD = 4,100 KHR). Both currencies are accepted via Bakong KHQR.",
  },
  {
    category: "payments",
    question: "Is Cash on Delivery (COD) supported?",
    answer:
      "Yes, Cash on Delivery is supported for all verified addresses in Phnom Penh, Siem Reap, and Battambang. You inspect the parcel upon rider arrival and hand cash directly to our delivery courier.",
  },

  // Delivery
  {
    category: "delivery",
    question: "How fast is delivery within Phnom Penh?",
    answer:
      "Orders placed before 6:00 PM in Phnom Penh are dispatched from our central fulfillment hub via our dedicated fleet of 800 Cassandra-tracked riders within 45 to 60 minutes. You can track your courier's live telemetry, speed, and location on the Order Details page.",
  },
  {
    category: "delivery",
    question: "How does delivery work for other provinces (Siem Reap, Battambang, Kandal)?",
    answer:
      "For Siem Reap, Battambang, and Kandal, deliveries arrive within 24 to 48 hours via our inter-provincial logistics network. All packages are sealed with tamper-proof security tape and climate-controlled handling for food and silk goods.",
  },
  {
    category: "delivery",
    question: "Can I track my delivery rider in real time?",
    answer:
      "Yes. On your `/orders/[id]` page, our digital-twin map streams real-time GPS pings from the courier's device powered by Apache Cassandra (recording 160 writes/sec), showing speed, battery level, and estimated time of arrival.",
  },

  // Returns & Buyer Protection
  {
    category: "returns",
    question: "What is Rentify's 7-Day Buyer Protection Guarantee?",
    answer:
      "Every purchase on Rentify is covered by our 7-Day Hassle-Free Guarantee. If an item arrives damaged, defective, wrong in size/color, or mismatched from its description, you can submit a return request directly from your order page for a full replacement or refund.",
  },
  {
    category: "returns",
    question: "How do I request a return or refund?",
    answer:
      "Navigate to 'Orders', open the delivered order, and click 'Request Return / Refund'. Select your reason, provide a brief note with photo evidence, and choose your refund destination (direct to your Bakong account or instant Rentify Wallet credit + 5% bonus). Our merchant team reviews claims within 24 hours.",
  },
  {
    category: "returns",
    question: "Are products guaranteed to be 100% authentic?",
    answer:
      "Yes. All merchants on Rentify undergo strict multi-tenant verification, including Ministry of Commerce registration and Tax Identification (TIN) validation. Handwoven Cambodian silk, PGI Kampot pepper, and electronic devices carry official certificates of authenticity and manufacturer warranties.",
  },

  // Orders
  {
    category: "orders",
    question: "Can I cancel an order after placing it?",
    answer:
      "Yes. While an order is in 'Pending' or 'Preparing' status, you can cancel it immediately with one click on the Order Details page. Once cancelled, your payment is refunded without any cancellation fees.",
  },
  {
    category: "orders",
    question: "How do I reorder items I previously bought ('Buy Again')?",
    answer:
      "Open any previous order on `/orders/[id]` and click the 'Buy Again' button. All items with their corresponding quantities will be instantly loaded back into your shopping cart drawer for rapid 1-click checkout.",
  },
  {
    category: "orders",
    question: "How do I download an official tax receipt?",
    answer:
      "Click 'View Tax Receipt' on any order details page. A General Department of Taxation (GDT) compliant fiscal invoice will open with itemized VAT breakdown and printable format.",
  },

  // Merchants
  {
    category: "merchants",
    question: "How can a local store or artisan open a shop on Rentify?",
    answer:
      "Local producers, tech distributors, and artisan guilds can click 'Merchant Store Studio' in the user menu or visit `/merchant`. Complete our 5-minute KYC registration with your Cambodian business registration or national ID. Approved merchants get 0% commission for the first 3 months.",
  },
  {
    category: "merchants",
    question: "What tools are provided in the Merchant Store Studio?",
    answer:
      "Merchants get an executive sales dashboard, polymorphic product catalog manager, order fulfillment pipeline with state-transition controls, live courier dispatch tracker, and full multi-tenant storefront profile customizer.",
  },
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "payments" | "delivery" | "returns" | "orders" | "merchants"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { key: "all", label: "All Topics", icon: HelpCircle },
    { key: "payments", label: "Bakong & Payments", icon: CreditCard },
    { key: "delivery", label: "Shipping & Delivery", icon: Truck },
    { key: "returns", label: "7-Day Returns & Warranty", icon: RotateCcw },
    { key: "orders", label: "Order Tracking & Cancel", icon: FileText },
    { key: "merchants", label: "Sell on Rentify", icon: Store },
  ];

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Help Center & Support</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mx-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Rentify Customer Protection & Support</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
          How can we help you today?
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Find answers regarding NBC Bakong KHQR payments, Cassandra rider tracking, 7-day hassle-free returns, and Cambodian merchant verification.
        </p>

        {/* Global Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden p-1.5">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search help articles (e.g. Bakong KHQR, refund, delivery speed, cancel order)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => {
                setActiveCategory(c.key as any);
                setOpenIndex(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout: FAQs + Support Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: FAQ Accordion List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Frequently Asked Questions ({filteredFaqs.length})</span>
            </h2>
            {searchQuery && (
              <span className="text-xs text-slate-500">
                Filtered by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No matching help articles found</h3>
              <p className="text-xs text-slate-500">
                Try searching with different keywords or reach out directly to our 24/7 support team.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                    >
                      <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Delivery Zones & SLA Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 mt-8">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>National Delivery Zones & Speed Guarantee</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Province / Zone</th>
                    <th className="py-2.5 px-3">Delivery SLA</th>
                    <th className="py-2.5 px-3">Tracking Engine</th>
                    <th className="py-2.5 px-3 text-right">Standard Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Phnom Penh (Urban)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">45 – 60 Mins (Same-Day)</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">Cassandra Live GPS</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">$1.50 (Free over $35)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Siem Reap</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">24 – 36 Hours</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">Regional Express Hub</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">$2.50</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Battambang</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">24 – 48 Hours</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">Northwest Depot</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">$2.50</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Kandal & Suburbs</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">Same-Day / Next-Day</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">Cassandra Fleet Ring</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">$2.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: 24/7 Support Channels */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Contact Support 24/7</span>
            </h3>
            <p className="text-xs text-slate-500">
              Our bilingual customer care team in Phnom Penh is ready to assist you in Khmer and English.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/60 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Telephone Hotline</span>
                </div>
                <p className="font-mono text-sm font-bold text-blue-950">+855 23 999 888</p>
                <span className="text-[10px] text-blue-600">Available Daily: 7:00 AM – 10:00 PM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Send className="w-4 h-4 text-sky-500" />
                  <span>Telegram Official Bot</span>
                </div>
                <p className="font-mono text-xs font-bold text-slate-800">@RentifyKhmerSupport</p>
                <span className="text-[10px] text-slate-500">Instant bot & human agent routing</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Email Support</span>
                </div>
                <p className="font-mono text-xs font-bold text-slate-800">support@rentify.com.kh</p>
                <span className="text-[10px] text-slate-500">Responses within 2 business hours</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/orders"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
              >
                <span>Track My Active Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Buyer Trust Guarantees */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-blue-300">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">The Rentify Promise</h4>
            </div>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Genuine Guaranteed:</strong> Verified Cambodian artisans & official distributors.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>NBC Bakong Security:</strong> High-grade cryptographic checkout with zero chargebacks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>7-Day Returns:</strong> Instant refund settlement on damaged or wrong items.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
