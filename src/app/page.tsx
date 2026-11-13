"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import CivicMap, { MapIssue } from "@/components/map/CivicMap";
import FilterBar from "@/components/FilterBar";
import IssueCard from "@/components/IssueCard";
import {
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Wrench,
  UserCheck,
  Sparkles,
  Layers,
  Activity,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const [issues, setIssues] = useState<MapIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Filters
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [city, setCity] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "ALL") params.set("status", status);
      if (category !== "ALL") params.set("category", category);
      if (city !== "ALL") params.set("city", city);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/issues?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setIssues(json.data);
      }
    } catch (e) {
      console.error("Error fetching issues:", e);
    } finally {
      setLoading(false);
    }
  }, [status, category, city, search]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleUpvote = async (issueId: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/upvote`, { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        setIssues((prev) =>
          prev.map((i) => (i.id === issueId ? { ...i, upvotes: json.upvotes } : i))
        );
      }
    } catch (e) {
      console.error("Upvote error:", e);
    }
  };

  const resetFilters = () => {
    setStatus("ALL");
    setCategory("ALL");
    setCity("ALL");
    setSearch("");
  };

  const openCount = issues.filter((i) => i.status === "OPEN").length;
  const inProgressCount = issues.filter((i) => i.status === "IN_PROGRESS").length;
  const resolvedCount = issues.filter((i) => i.status === "RESOLVED").length;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>CivicPulse v2 • Next.js 15 Full-Stack Civic Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Real-Time Public Civic Response for{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Tamil Nadu
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Unifying citizens, municipal workers, and administrative departments across Chennai, Coimbatore, and Madurai with live OpenStreetMap GIS telemetry and zero CORS overhead.
          </p>

          {/* 3 Quick Role Launchers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left">
            {/* Citizen Hub card */}
            <Link
              href="/citizen"
              className="group p-5 rounded-3xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-blue-400/50 transition-all shadow-lg"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                Citizen Portal
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Drop pins on map to report potholes, garbage & drainage problems.
              </p>
            </Link>

            {/* Worker Queue card */}
            <Link
              href="/worker"
              className="group p-5 rounded-3xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-all shadow-lg"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                Worker Queue
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Field supervisor queue with status updates & repair resolution notes.
              </p>
            </Link>

            {/* Admin Console card */}
            <Link
              href="/admin"
              className="group p-5 rounded-3xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-purple-400/50 transition-all shadow-lg"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                Admin Console
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Analytics cards, statewide map, and 1-click worker assignment.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-slate-900">{issues.length}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Incidents</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-rose-600">{openCount}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Open / Untriaged</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-amber-600">{inProgressCount}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">In Progress</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-black text-emerald-600">{resolvedCount}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Solved & Verified</span>
            </div>
          </div>
        </div>

        {/* Live Filter Bar */}
        <FilterBar
          status={status}
          onStatusChange={setStatus}
          category={category}
          onCategoryChange={setCategory}
          city={city}
          onCityChange={setCity}
          search={search}
          onSearchChange={setSearch}
          onReset={resetFilters}
          totalCount={issues.length}
        />

        {/* Main Map + Side Feed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map (7 cols) */}
          <div className="lg:col-span-7 bg-white p-3 rounded-3xl shadow-sm border border-slate-200">
            <div className="mb-2 px-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Live Tamil Nadu Incident Map
              </span>
              <span className="text-[11px] text-slate-400">
                Click any marker for details and resolution notes
              </span>
            </div>
            <CivicMap
              issues={issues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={(issue) => setSelectedIssueId(issue.id)}
              onUpvote={handleUpvote}
              height="580px"
            />
          </div>

          {/* Side-Panel Issue Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5 max-h-[630px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Active Civic Incident Feed
              </h2>
              <span className="text-xs text-slate-500">
                {issues.length} issues loaded
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs">Loading incident feed...</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No issues match your current filters.
              </div>
            ) : (
              issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  isSelected={selectedIssueId === issue.id}
                  onSelect={(i) => setSelectedIssueId(i.id)}
                  onUpvote={handleUpvote}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
