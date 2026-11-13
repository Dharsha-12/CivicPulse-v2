"use client";

import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CheckCircle2, Clock, AlertTriangle, ThumbsUp, MapPin, Wrench } from "lucide-react";

export interface MapIssue {
  id: string;
  title: string;
  description: string;
  category: "POTHOLE" | "STREETLIGHT" | "GARBAGE" | "WATER_LEAK" | "DRAINAGE";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  imageUrl?: string | null;
  resolutionNote?: string | null;
  resolvedAt?: string | null;
  upvotes: number;
  assignedWorker?: { name: string; department?: string | null } | null;
  createdAt: string | Date;
}

interface CivicMapInnerProps {
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

// Controller to handle center changes and map clicks
function MapController({
  selectedIssue,
  clickedCoords,
  onMapClick,
}: {
  selectedIssue?: MapIssue | null;
  clickedCoords?: { lat: number; lng: number } | null;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  useEffect(() => {
    if (selectedIssue) {
      map.flyTo([selectedIssue.latitude, selectedIssue.longitude], 15, {
        duration: 1.2,
      });
    }
  }, [selectedIssue, map]);

  useEffect(() => {
    if (clickedCoords) {
      map.flyTo([clickedCoords.lat, clickedCoords.lng], 15, {
        duration: 0.8,
      });
    }
  }, [clickedCoords, map]);

  return null;
}

export default function CivicMapInner({
  issues,
  selectedIssueId,
  onSelectIssue,
  clickedCoords,
  onMapClick,
  onUpvote,
  height = "560px",
  center = [11.5, 78.5], // Center of Tamil Nadu
  zoom = 7,
}: CivicMapInnerProps) {
  const selectedIssue = useMemo(
    () => issues.find((i) => i.id === selectedIssueId) || null,
    [issues, selectedIssueId]
  );

  // Custom DivIcons for color-coded markers
  const createMarkerIcon = (status: "OPEN" | "IN_PROGRESS" | "RESOLVED", isSelected: boolean) => {
    let bgColor = "bg-rose-500";
    let ringColor = "ring-rose-400";
    let badge = "!";

    if (status === "RESOLVED") {
      bgColor = "bg-emerald-600";
      ringColor = "ring-emerald-400";
      badge = "✓";
    } else if (status === "IN_PROGRESS") {
      bgColor = "bg-amber-500";
      ringColor = "ring-amber-400";
      badge = "⚡";
    }

    const scale = isSelected ? "scale-125 z-50 ring-4" : "hover:scale-110";

    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center transition-transform duration-200 ${scale}">
          <div class="w-8 h-8 rounded-full ${bgColor} text-white font-bold text-xs flex items-center justify-center shadow-lg ring-2 ${ringColor} ring-offset-2 ring-offset-white">
            ${badge}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 ${bgColor} rotate-45 transform"></div>
        </div>
      `,
      iconSize: [32, 36],
      iconAnchor: [16, 36],
      popupAnchor: [0, -36],
    });
  };

  const newPinIcon = L.divIcon({
    className: "custom-pin-icon",
    html: `
      <div class="relative flex items-center justify-center animate-bounce">
        <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl ring-4 ring-blue-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 44],
    iconAnchor: [20, 44],
    popupAnchor: [0, -44],
  });

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-slate-200" style={{ height }}>
      {/* Interactive Legend Header */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200/80 text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm"></span>
          Open
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm"></span>
          In Progress
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-sm"></span>
          Resolved
        </div>
        {onMapClick && (
          <div className="hidden sm:flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium border border-blue-200">
            <MapPin className="w-3 h-3" />
            Click map to drop pin
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedIssue={selectedIssue}
          clickedCoords={clickedCoords}
          onMapClick={onMapClick}
        />

        {/* Existing issues markers */}
        {issues.map((issue) => {
          const isSelected = selectedIssueId === issue.id;
          return (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createMarkerIcon(issue.status, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectIssue) onSelectIssue(issue);
                },
              }}
            >
              <Popup className="civic-popup">
                <div className="w-72 sm:w-80 p-4 bg-white text-slate-800">
                  {/* Category & Status header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
                      {issue.category.replace("_", " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-full flex items-center gap-1 ${
                        issue.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : issue.status === "IN_PROGRESS"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {issue.status === "RESOLVED" && <CheckCircle2 className="w-3 h-3" />}
                      {issue.status === "IN_PROGRESS" && <Clock className="w-3 h-3" />}
                      {issue.status === "OPEN" && <AlertTriangle className="w-3 h-3" />}
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 leading-snug">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-2.5">
                    {issue.description}
                  </p>

                  {/* Location address */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {issue.address}, <strong className="text-slate-700">{issue.city}</strong>
                    </span>
                  </div>

                  {/* Resolution Note if Resolved */}
                  {issue.status === "RESOLVED" && issue.resolutionNote && (
                    <div className="mb-3 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 text-xs text-emerald-900">
                      <div className="flex items-center gap-1 font-semibold text-emerald-800 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Resolution Summary:
                      </div>
                      <p className="text-emerald-950/80 leading-relaxed italic">
                        &quot;{issue.resolutionNote}&quot;
                      </p>
                    </div>
                  )}

                  {/* Assigned Worker Info */}
                  {issue.assignedWorker && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                      <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        Assigned to: <strong>{issue.assignedWorker.name}</strong>{" "}
                        {issue.assignedWorker.department && `(${issue.assignedWorker.department})`}
                      </span>
                    </div>
                  )}

                  {/* Footer with Upvote Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Coordinates: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUpvote) onUpvote(issue.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 active:scale-95 transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{issue.upvotes}</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Temporary clicked pin for issue reporting */}
        {clickedCoords && (
          <Marker position={[clickedCoords.lat, clickedCoords.lng]} icon={newPinIcon}>
            <Popup autoPan={false}>
              <div className="p-3 text-xs text-slate-800">
                <p className="font-bold text-blue-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Target Reporting Location
                </p>
                <p className="text-slate-600 mb-2">
                  Latitude: {clickedCoords.lat.toFixed(6)}
                  <br />
                  Longitude: {clickedCoords.lng.toFixed(6)}
                </p>
                <p className="text-[11px] text-slate-500">
                  Fill in the issue details in the report form to submit.
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
