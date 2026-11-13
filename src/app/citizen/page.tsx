"use client";

import React, { useState, useEffect, useCallback } from "react";
import CivicMap, { MapIssue } from "@/components/map/CivicMap";
import FilterBar from "@/components/FilterBar";
import IssueCard from "@/components/IssueCard";
import ReportIssueModal from "@/components/ReportIssueModal";
import {
  PlusCircle,
  MapPin,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  Info,
} from "lucide-react";

interface CitizenIssue extends MapIssue {
  citizenId?: string;
  citizen?: { id: string; name: string; email: string; city: string } | null;
}

export default function CitizenDashboard() {
  const [issues, setIssues] = useState<CitizenIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Filters
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [city, setCity] = useState("ALL");
  const [search, setSearch] = useState("");

  // Sub-tabs for Citizen: "ALL_MAP" | "MY_REPORTS" | "SOLVED_FEED"
  const [activeTab, setActiveTab] = useState<"ALL_MAP" | "MY_REPORTS" | "SOLVED_FEED">("ALL_MAP");

  // Reporting modal state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          setCurrentUserId(json.user?.id || null);
        }
      } catch (e) {
        console.error("Auth check error:", e);
      }
    }
    checkUser();
  }, []);

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

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setClickedCoords(coords);
    setIsReportOpen(true);
  };

  const handleIssueCreated = (newIssue: MapIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setSelectedIssueId(newIssue.id);
    setClickedCoords(null);
  };

  const resetFilters = () => {
    setStatus("ALL");
    setCategory("ALL");
    setCity("ALL");
    setSearch("");
  };

  // Filter issues according to current active view tab
  const displayedIssues = issues.filter((issue) => {
    if (activeTab === "MY_REPORTS") {
      // Citizen demo account or logged in citizen
      return (
        issue.citizenId === currentUserId ||
        issue.citizen?.email === "citizen@civicpulse.in"
      );
    }
    if (activeTab === "SOLVED_FEED") {
      return issue.status === "RESOLVED";
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Citizen Civic Action Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tamil Nadu Citizen Dashboard
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Spot an infrastructure defect? Click anywhere on the map to drop a pin and directly notify the municipal field squad.
          </p>
        </div>

        <button
          onClick={() => {
            setClickedCoords({ lat: 13.0418, lng: 80.2341 }); // Chennai default
            setIsReportOpen(true);
          }}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-extrabold text-sm shadow-lg shadow-black/10 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-blue-600" />
          Report New Issue
        </button>
      </div>

      {/* Citizen View Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1">
        <button
          onClick={() => setActiveTab("ALL_MAP")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === "ALL_MAP"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Interactive Map & All Reports
        </button>

        <button
          onClick={() => setActiveTab("MY_REPORTS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === "MY_REPORTS"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          My Reports
        </button>

        <button
          onClick={() => setActiveTab("SOLVED_FEED")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === "SOLVED_FEED"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Community Solved Feed
        </button>
      </div>

      {/* Filter Bar */}
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
        totalCount={displayedIssues.length}
      />

      {/* Click-to-Pin Info Bar */}
      {activeTab === "ALL_MAP" && (
        <div className="flex items-center gap-2 p-3 bg-blue-50/80 border border-blue-200/70 rounded-2xl text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Interactive Pin-Drop Active:</strong> Click anywhere directly on the map below to pinpoint an issue location and open the pre-filled report dialog.
          </span>
        </div>
      )}

      {/* Main Grid: Interactive Map + Side Issue Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Panel (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-white p-3 rounded-3xl shadow-sm border border-slate-200">
          <CivicMap
            issues={displayedIssues}
            selectedIssueId={selectedIssueId}
            onSelectIssue={(issue) => setSelectedIssueId(issue.id)}
            clickedCoords={clickedCoords}
            onMapClick={handleMapClick}
            onUpvote={handleUpvote}
            height="580px"
          />
        </div>

        {/* Side-Panel Issue Feed (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[620px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-800">
              {activeTab === "MY_REPORTS"
                ? "My Submitted Reports"
                : activeTab === "SOLVED_FEED"
                ? "Community Solved Feed"
                : "Live Neighborhood Feed"}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Click an issue to focus on map
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs">Loading civic issues...</p>
            </div>
          ) : displayedIssues.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No issues match the selected criteria.
            </div>
          ) : (
            displayedIssues.map((issue) => (
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

      {/* Report Modal */}
      <ReportIssueModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        clickedCoords={clickedCoords}
        onIssueCreated={handleIssueCreated}
      />
    </div>
  );
}
