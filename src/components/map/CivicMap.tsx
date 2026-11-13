"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { MapIssue } from "./CivicMapInner";

export type { MapIssue };

interface CivicMapProps {
  issues: MapIssue[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: MapIssue) => void;
  clickedCoords?: { lat: number; lng: number } | null;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  onUpvote?: (id: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
}

const DynamicMap = dynamic(() => import("./CivicMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[560px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 animate-pulse border border-slate-200">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-3"></div>
      <p className="text-sm font-medium text-slate-600">Loading Tamil Nadu Civic Map...</p>
      <p className="text-xs text-slate-400">Rendering real-time OpenStreetMap tiles</p>
    </div>
  ),
});

export default function CivicMap(props: CivicMapProps) {
  return <DynamicMap {...props} />;
}
