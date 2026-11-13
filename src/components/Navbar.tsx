"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  Wrench,
  User as UserIcon,
  LogOut,
  LogIn,
  Activity,
  Menu,
  X,
  Layers,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "CITIZEN" | "WORKER" | "ADMIN";
  city: string;
  department?: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "WORKER":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CITIZEN":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                    CivicPulse
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] font-bold rounded-md tracking-wider">
                    v2
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Tamil Nadu Civic Action Network
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === "/"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Civic Map
              </Link>

              <Link
                href="/citizen"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/citizen")
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <MapPin className="w-4 h-4 text-blue-500" />
                Citizen Hub
              </Link>

              <Link
                href="/worker"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/worker")
                    ? "bg-amber-50 text-amber-800 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                Worker Queue
              </Link>

              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-purple-50 text-purple-800 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Admin Console
              </Link>
            </nav>
          </div>

          {/* Right Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-full px-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-semibold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {user.city} {user.department && `• ${user.department}`}
                    </span>
                  </div>
                  <span
                    className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${roleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : !loading ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            ) : null}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <nav className="flex flex-col gap-1 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Civic Map Overview
            </Link>
            <Link
              href="/citizen"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-blue-500" />
              Citizen Hub
            </Link>
            <Link
              href="/worker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              Worker Queue
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              Admin Console
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">
                    {user.email} • {user.role}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
              >
                Sign In / Demo Roles
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
