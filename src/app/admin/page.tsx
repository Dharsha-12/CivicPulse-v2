"use client";

import React, { useState, useEffect, useCallback } from "react";
import CivicMap, { MapIssue } from "@/components/map/CivicMap";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Layers,
  MapPin,
  UserCheck,
  TrendingUp,
  Building,
  Check,
} from "lucide-react";

interface WorkerOption {
  id: string;
  name: string;
  email: string;
  city: string;
  department?: string | null;
}

interface AnalyticsData {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  categoryBreakdown: Record<string, number>;
  cityBreakdown: Record<string, number>;
}

interface AdminIssue extends MapIssue {
  citizen?: { id: string; name: string; email: string; city: string } | null;
  assignedWorkerId?: string | null;
}

export default function AdminDashboard() {
  const [issues, setIssues] = useState<AdminIssue[]>([]);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [issuesRes, workersRes, analyticsRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/workers"),
        fetch("/api/analytics"),
      ]);

      if (issuesRes.ok) {
        const json = await issuesRes.json();
        setIssues(json.data);
      }
      if (workersRes.ok) {
        const json = await workersRes.json();
        setWorkers(json.data);
      }
      if (analyticsRes.ok) {
        const json = await analyticsRes.json();
        setAnalytics(json.data);
      }
    } catch (e) {
      console.error("Admin data fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignWorker = async (issueId: string, workerId: string) => {
    try {
      setUpdatingId(issueId);
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedWorkerId: workerId || null,
          status: workerId ? "IN_PROGRESS" : "OPEN",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const updated = json.data;
        setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
        setSuccessToast(`Dispatched to ${updated.assignedWorker?.name || "unassigned"}`);
        setTimeout(() => setSuccessToast(""), 3000);
        // Refresh analytics
        const aRes = await fetch("/api/analytics");
        if (aRes.ok) {
          const aJson = await aRes.json();
          setAnalytics(aJson.data);
        }
      }
    } catch (e) {
      console.error("Assignment error:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            Tamil Nadu Municipal Administration Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Console & Dispatch Engine
          </h1>
          <p className="text-purple-200 text-sm mt-1 max-w-xl">
            Real-time telemetry, municipal workload distribution, and instant field squad dispatch across Chennai, Coimbatore & Madurai.
          </p>
        </div>

        {successToast && (
          <div className="bg-emerald-500/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Analytics Summary Cards (Requirement 4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Issues
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {analytics?.total ?? issues.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Logged across all wards</p>
        </div>

        {/* Open Awaiting Triage */}
        <div className="bg-white p-5 rounded-3xl border border-rose-200/90 shadow-sm bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Open Issues
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-700">
            {analytics?.open ?? issues.filter((i) => i.status === "OPEN").length}
          </div>
          <p className="text-[11px] text-rose-600/80 mt-1">Requires worker dispatch</p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700">
            {analytics?.inProgress ?? issues.filter((i) => i.status === "IN_PROGRESS").length}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">Under active repair</p>
        </div>

        {/* Solved / Resolved */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/90 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {analytics?.resolved ?? issues.filter((i) => i.status === "RESOLVED").length}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">Public verified resolutions</p>
        </div>
      </div>

      {/* Regional & Category Breakdown bar */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City Distribution */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Regional Civic Caseload Distribution
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(analytics.cityBreakdown).map(([city, count]) => (
                <div key={city} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-xs font-bold text-slate-800 block">{city}</span>
                  <span className="text-lg font-black text-blue-600">{count}</span>
                  <span className="text-[10px] text-slate-400 block">issues</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              Category Breakdown
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analytics.categoryBreakdown).map(([cat, count]) => (
                <div
                  key={cat}
                  className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center gap-2"
                >
                  <span className="font-semibold text-slate-700">{cat.replace("_", " ")}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-200 font-bold text-slate-800 text-[11px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Map Panel */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Statewide Real-Time Incident Map
            </h2>
            <p className="text-xs text-slate-500">
              Live geographic positioning of all civic work orders across Tamil Nadu
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {issues.length} Active Pins
          </span>
        </div>
        <CivicMap
          issues={issues}
          selectedIssueId={selectedIssueId}
          onSelectIssue={(i) => setSelectedIssueId(i.id)}
          height="480px"
        />
      </div>

      {/* Triage & Worker Assignment Table (Requirement 4) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Municipal Triage & Worker Assignment Table
            </h2>
            <p className="text-xs text-slate-500">
              Assign field engineers and maintenance units directly to open or re-opened civic incidents
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
            {workers.length} Registered Field Engineers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Incident Title & Location</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Citizen Contact</th>
                <th className="px-4 py-3">Assigned Field Worker</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Loading incident table...
                  </td>
                </tr>
              ) : (
                issues.map((issue) => {
                  const isUpdating = updatingId === issue.id;

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className={`hover:bg-slate-50/70 cursor-pointer transition-colors ${
                        selectedIssueId === issue.id ? "bg-purple-50/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{issue.title}</p>
                        <p className="text-slate-500 text-[11px] truncate">
                          {issue.address}, <strong>{issue.city}</strong>
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                          {issue.category.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                            issue.status === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : issue.status === "IN_PROGRESS"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {issue.citizen?.name || "Verified Citizen"}
                      </td>

                      {/* Worker Assignment Dropdown (Requirement 4) */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <select
                            disabled={isUpdating}
                            value={issue.assignedWorkerId || ""}
                            onChange={(e) => handleAssignWorker(issue.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
                          >
                            <option value="">-- Unassigned --</option>
                            {workers.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.name} ({w.department || w.city})
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedIssueId(issue.id)}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Focus Map
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
