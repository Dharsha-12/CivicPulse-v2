"use client";

import React, { useState, useEffect, useCallback } from "react";
import CivicMap, { MapIssue } from "@/components/map/CivicMap";
import IssueCard from "@/components/IssueCard";
import ResolveIssueModal from "@/components/ResolveIssueModal";
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  MapPin,
  Filter,
} from "lucide-react";

export default function WorkerDashboard() {
  const [issues, setIssues] = useState<MapIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Status Filter within Worker view
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [resolvingIssue, setResolvingIssue] = useState<MapIssue | null>(null);

  const fetchWorkerIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/issues");
      if (res.ok) {
        const json = await res.json();
        setIssues(json.data);
      }
    } catch (e) {
      console.error("Worker issues fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkerIssues();
  }, [fetchWorkerIssues]);

  const handleStatusChange = async (issueId: string, newStatus: "IN_PROGRESS" | "OPEN") => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        setIssues((prev) =>
          prev.map((i) => (i.id === issueId ? { ...i, status: json.data.status } : i))
        );
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleResolved = (updatedIssue: MapIssue) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === updatedIssue.id ? updatedIssue : i))
    );
  };

  // Filter issues for display
  const displayedIssues = issues.filter((i) => {
    if (statusFilter === "ALL") return true;
    return i.status === statusFilter;
  });

  const assignedCount = issues.filter((i) => i.status === "IN_PROGRESS").length;
  const openCount = issues.filter((i) => i.status === "OPEN").length;
  const resolvedCount = issues.filter((i) => i.status === "RESOLVED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <Wrench className="w-3.5 h-3.5 text-white" />
            Field Operations & Repair Queue
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Field Worker Task Queue
          </h1>
          <p className="text-amber-100 text-sm mt-1 max-w-xl">
            Triage public work orders across Roads, Streetlights, Sanitation & Drainage. Update live status as you complete repairs.
          </p>
        </div>

        {/* Quick metrics counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
            <span className="block text-2xl font-black">{assignedCount}</span>
            <span className="text-[11px] font-semibold uppercase text-amber-100">In Progress</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
            <span className="block text-2xl font-black">{openCount}</span>
            <span className="text-[11px] font-semibold uppercase text-amber-100">Open Queue</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
            <span className="block text-2xl font-black">{resolvedCount}</span>
            <span className="text-[11px] font-semibold uppercase text-amber-100">Completed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Queue:
          </span>

          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Orders ({issues.length})
          </button>

          <button
            onClick={() => setStatusFilter("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "IN_PROGRESS"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            In Progress ({assignedCount})
          </button>

          <button
            onClick={() => setStatusFilter("OPEN")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "OPEN"
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Awaiting Triage ({openCount})
          </button>

          <button
            onClick={() => setStatusFilter("RESOLVED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "RESOLVED"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Logged in as: <strong>R. Murugan (worker@civicpulse.in)</strong>
        </span>
      </div>

      {/* Main Grid: Interactive Map + Actionable Work Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Work Order Cards List (6 cols) */}
        <div className="lg:col-span-6 space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs">Loading work order queue...</p>
            </div>
          ) : displayedIssues.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No work orders in this category.
            </div>
          ) : (
            displayedIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssueId === issue.id}
                onSelect={(i) => setSelectedIssueId(i.id)}
                showActions={
                  <div className="flex items-center gap-2">
                    {issue.status === "OPEN" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(issue.id, "IN_PROGRESS")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Mark In Progress
                      </button>
                    )}

                    {issue.status === "IN_PROGRESS" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setResolvingIssue(issue)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Resolved
                        </button>
                      </>
                    )}

                    {issue.status === "RESOLVED" && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        Work Verified
                      </span>
                    )}
                  </div>
                }
              />
            ))
          )}
        </div>

        {/* Map Panel (6 cols) */}
        <div className="lg:col-span-6 bg-white p-3 rounded-3xl shadow-sm border border-slate-200 sticky top-20">
          <div className="mb-2 px-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              Field Dispatch Geographic Overview
            </span>
            <span className="text-[11px] text-slate-500">Live coordinates</span>
          </div>
          <CivicMap
            issues={displayedIssues}
            selectedIssueId={selectedIssueId}
            onSelectIssue={(issue) => setSelectedIssueId(issue.id)}
            height="560px"
          />
        </div>
      </div>

      {/* Modal for entering resolution note when marking resolved */}
      <ResolveIssueModal
        isOpen={!!resolvingIssue}
        issue={resolvingIssue}
        onClose={() => setResolvingIssue(null)}
        onResolved={handleResolved}
      />
    </div>
  );
}
