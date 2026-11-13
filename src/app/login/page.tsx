"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Wrench,
  UserCheck,
  Activity,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";
import Link from "next/link";

type RoleType = "CITIZEN" | "WORKER" | "ADMIN";

const DEMO_CREDENTIALS: Record<
  RoleType,
  { email: string; pass: string; title: string; desc: string; badge: string; color: string }
> = {
  CITIZEN: {
    email: "citizen@civicpulse.in",
    pass: "CivicPulse2026!",
    title: "Citizen Account",
    desc: "Ananya Ramachandran (Chennai) • Pin-drop reporting, community upvotes & neighborhood feed",
    badge: "CITIZEN",
    color: "from-blue-600 to-sky-600",
  },
  WORKER: {
    email: "worker@civicpulse.in",
    pass: "CivicPulse2026!",
    title: "Field Supervisor Account",
    desc: "R. Murugan (Roads & Electrical) • Task queue, triage status controls & resolution logs",
    badge: "WORKER",
    color: "from-amber-600 to-orange-600",
  },
  ADMIN: {
    email: "admin@civicpulse.in",
    pass: "CivicPulse2026!",
    title: "Chief Municipal Admin",
    desc: "Suresh Kumar (Admin Console) • Macro analytics, city breakdown & worker dispatch",
    badge: "ADMIN",
    color: "from-purple-600 to-indigo-600",
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<RoleType>("CITIZEN");

  // Login form state
  const [email, setEmail] = useState("citizen@civicpulse.in");
  const [password, setPassword] = useState("CivicPulse2026!");
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCity, setRegCity] = useState("Chennai");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].pass);
    setError("");
  };

  const handleAutofill = (role: RoleType) => {
    handleRoleSelect(role);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      const role = data.user.role;
      let target = callbackUrl;
      if (!target || target === "/login") {
        if (role === "ADMIN") target = "/admin";
        else if (role === "WORKER") target = "/worker";
        else target = "/citizen";
      }

      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          city: regCity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/citizen");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration error");
    } finally {
      setLoading(false);
    }
  };

  const activeDemo = DEMO_CREDENTIALS[selectedRole];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100">
      <div className="w-full max-w-xl">
        {/* Editorial Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse text-blue-600" />
            Tamil Nadu Unified Civic Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome to CivicPulse
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
            Connect citizens, field crews, and municipal administrators across Chennai, Coimbatore & Madurai
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden">
          {/* Top Mode Tabs */}
          <div className="flex border-b border-slate-200/80 bg-slate-50/70 p-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Role Login & Demo Access
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              New Citizen Registration
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === "login" ? (
              <div>
                {/* 3-Role Quick Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Select Role Quick-Access
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600">
                      Click to toggle role
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect("CITIZEN")}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedRole === "CITIZEN"
                          ? "border-blue-600 bg-blue-50/80 shadow-sm ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70"
                      }`}
                    >
                      <UserCheck
                        className={`w-5 h-5 ${
                          selectedRole === "CITIZEN" ? "text-blue-600" : "text-slate-500"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-900">Citizen</span>
                      <span className="text-[10px] text-slate-500">Report & Track</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleSelect("WORKER")}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedRole === "WORKER"
                          ? "border-amber-500 bg-amber-50/80 shadow-sm ring-2 ring-amber-500/20"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70"
                      }`}
                    >
                      <Wrench
                        className={`w-5 h-5 ${
                          selectedRole === "WORKER" ? "text-amber-600" : "text-slate-500"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-900">Worker</span>
                      <span className="text-[10px] text-slate-500">Field Squad</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleSelect("ADMIN")}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        selectedRole === "ADMIN"
                          ? "border-purple-600 bg-purple-50/80 shadow-sm ring-2 ring-purple-500/20"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70"
                      }`}
                    >
                      <ShieldCheck
                        className={`w-5 h-5 ${
                          selectedRole === "ADMIN" ? "text-purple-600" : "text-slate-500"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-900">Admin</span>
                      <span className="text-[10px] text-slate-500">City Control</span>
                    </button>
                  </div>

                  {/* Active Role Card Preview */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-900">
                          {activeDemo.title}
                        </span>
                        <span
                          className={`px-2 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r ${activeDemo.color} text-white`}
                        >
                          {activeDemo.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {activeDemo.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutofill(selectedRole)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Autofill Demo
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. citizen@civicpulse.in"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Demo: CivicPulse2026!
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    <span>{loading ? "Authenticating..." : `Sign In as ${selectedRole}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Citizen Self-Registration Tab */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs text-blue-900 mb-2">
                  <p className="font-bold flex items-center gap-1.5 mb-0.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Public Citizen Registration
                  </p>
                  <p className="text-blue-800/80">
                    Join the civic monitoring network to report road, sanitation, lighting, and drainage issues across your ward.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. K. Karthik"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="karthik@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Jurisdiction *
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password (min 6 characters) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  <span>{loading ? "Creating Account..." : "Create Citizen Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>
            Demo credentials configured for:{" "}
            <span className="font-mono text-slate-700">admin@civicpulse.in</span> •{" "}
            <span className="font-mono text-slate-700">worker@civicpulse.in</span> •{" "}
            <span className="font-mono text-slate-700">citizen@civicpulse.in</span>
          </p>
          <div className="mt-2">
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              ← Return to Public Civic Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
