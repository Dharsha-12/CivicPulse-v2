"use client";

import React from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterBarProps {
  status: string;
  onStatusChange: (status: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  totalCount: number;
}

export default function FilterBar({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  city,
  onCityChange,
  search,
  onSearchChange,
  onReset,
  totalCount,
}: FilterBarProps) {
  const statuses = [
    { label: "All Statuses", value: "ALL" },
    { label: "Open", value: "OPEN", dot: "bg-rose-500" },
    { label: "In Progress", value: "IN_PROGRESS", dot: "bg-amber-500" },
    { label: "Resolved", value: "RESOLVED", dot: "bg-emerald-600" },
  ];

  const categories = [
    { label: "All Categories", value: "ALL" },
    { label: "Pothole", value: "POTHOLE" },
    { label: "Streetlight", value: "STREETLIGHT" },
    { label: "Garbage", value: "GARBAGE" },
    { label: "Water Leak", value: "WATER_LEAK" },
    { label: "Drainage", value: "DRAINAGE" },
  ];

  const cities = [
    { label: "All Cities", value: "ALL" },
    { label: "Chennai", value: "Chennai" },
    { label: "Coimbatore", value: "Coimbatore" },
    { label: "Madurai", value: "Madurai" },
  ];

  const isFiltered = status !== "ALL" || category !== "ALL" || city !== "ALL" || search.trim() !== "";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 mb-4 space-y-3.5">
      {/* Top Search & City row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search issues, road names, areas..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Region:</span>
          </div>
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {cities.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-xl">
            {totalCount} {totalCount === 1 ? "issue" : "issues"}
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 mr-1.5">Status:</span>
        {statuses.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onStatusChange(s.value)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
              status === s.value
                ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-900"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
            }`}
          >
            {s.dot && <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>}
            {s.label}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-400 mr-1.5">Category:</span>
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onCategoryChange(c.value)}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
              category === c.value
                ? "bg-blue-600 text-white shadow-sm font-semibold"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
