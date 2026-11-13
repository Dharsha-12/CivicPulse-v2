"use client";

import React from "react";
import { MapPin, ThumbsUp, CheckCircle2, Clock, AlertTriangle, Wrench } from "lucide-react";
import type { MapIssue } from "./map/CivicMap";

interface IssueCardProps {
  issue: MapIssue;
  isSelected?: boolean;
  onSelect?: (issue: MapIssue) => void;
  onUpvote?: (id: string) => void;
  showActions?: React.ReactNode;
}

export default function IssueCard({
  issue,
  isSelected = false,
  onSelect,
  onUpvote,
  showActions,
}: IssueCardProps) {
  const statusConfig = {
    RESOLVED: {
      label: "Resolved",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    IN_PROGRESS: {
      label: "In Progress",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    },
    OPEN: {
      label: "Open",
      badge: "bg-rose-50 text-rose-800 border-rose-200",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    },
  }[issue.status];

  const categoryLabels: Record<string, string> = {
    POTHOLE: "Pothole",
    STREETLIGHT: "Streetlight",
    GARBAGE: "Garbage",
    WATER_LEAK: "Water Leak",
    DRAINAGE: "Drainage",
  };

  return (
    <div
      onClick={() => onSelect && onSelect(issue)}
      className={`group relative p-4 rounded-2xl bg-white border transition-all cursor-pointer ${
        isSelected
          ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-blue-50/10"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Category & Status badges */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
          {categoryLabels[issue.category] || issue.category}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.badge}`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
        {issue.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
        {issue.description}
      </p>

      {/* Address */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">
          {issue.address}, <strong className="text-slate-700">{issue.city}</strong>
        </span>
      </div>

      {/* Resolution Note banner if resolved */}
      {issue.status === "RESOLVED" && issue.resolutionNote && (
        <div className="mb-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-950">
          <div className="flex items-center gap-1 font-bold text-emerald-800 text-[11px] mb-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolution Summary
          </div>
          <p className="italic text-slate-700 line-clamp-2">&quot;{issue.resolutionNote}&quot;</p>
        </div>
      )}

      {/* Assigned Worker info */}
      {issue.assignedWorker && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-amber-50/70 border border-amber-200/50 px-2 py-1 rounded-lg mb-3">
          <Wrench className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="truncate">
            Worker: <strong>{issue.assignedWorker.name}</strong>{" "}
            {issue.assignedWorker.department && `(${issue.assignedWorker.department})`}
          </span>
        </div>
      )}

      {/* Footer Upvote & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onUpvote) onUpvote(issue.id);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700 active:scale-95 transition-all border border-slate-200/70"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{issue.upvotes} Upvotes</span>
        </button>

        {showActions && <div onClick={(e) => e.stopPropagation()}>{showActions}</div>}
      </div>
    </div>
  );
}
