/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { AppLogo } from "../components/ui/AppLogo";
import {
  Shield,
  Mail,
  User,
  Phone,
  CheckCircle,
  GraduationCap,
  Unlock,
  Info,
  Laptop,
  ChevronDown,
  Lock,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authService } from "../services/authService";

export const AuthPages: React.FC<{
  type: "login" | "register" | "forgot-password" | "admin-login";
}> = ({ type }) => {
  const { login, register, navigate, viewState } = useApp();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");

  const [institutions, setInstitutions] = useState<any[]>([]);
  React.useEffect(() => {
    authService
      .getInstitutions()
      .then((list) => {
        setInstitutions(list);
        if (list.length > 0) {
          setUniversity(list[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch institutions:", err);
        setInstitutions([]);
      });
  }, []);

  // Optional device fields
  const [showDeviceFields, setShowDeviceFields] = useState(false);
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [plans, setPlans] = useState<any[]>([]);
  React.useEffect(() => {
    authService
      .getPlans()
      .then((res) => {
        setPlans(res || []);
      })
      .catch((err) => {
        console.error("Failed to load plans:", err);
        setPlans([]);
      });
  }, []);

  const selectedPlanId = viewState?.selectPlanId || "";
  const mappedType =
    selectedPlanId === "bonanza-plan"
      ? "BONANZA"
      : selectedPlanId === "premium-plan"
        ? "PREMIUM"
        : "BASIC";
  const dbPlan =
    plans.find((p: any) => p.type === mappedType || p.id === selectedPlanId) ||
    plans.find((p: any) => p.type === "BASIC") ||
    plans[0];

  const planName = dbPlan
    ? `${dbPlan.type.charAt(0) + dbPlan.type.slice(1).toLowerCase()} Plan Cover`
    : "Plan Cover";
  const planPrice = dbPlan ? `GH₵${dbPlan.fee}` : "--";

  const handleAutoFill = async (role: "student" | "admin") => {
    if (role === "student") {
      setEmail("student@university.edu");
    } else {
      setEmail("admin@studentshield.com");
    }
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (type === "login") {
      const serviceId = email.trim();
      if (!serviceId) {
        setErrorMsg("Service ID is required.");
        setLoading(false);
        return;
      }
      try {
        const success = await login(serviceId, "SUBSCRIBER");
        if (!success) {
          setErrorMsg(
            "Authentication failed. Please verify your Student Service ID.",
          );
          setLoading(false);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Authentication error. Please try again.");
        setLoading(false);
      }
    } else if (type === "admin-login") {
      const serviceId = email.trim();
      if (!serviceId) {
        setErrorMsg("Service ID is required.");
        setLoading(false);
        return;
      }
      try {
        const success = await login(serviceId, "ADMIN");
        if (!success) {
          setErrorMsg(
            "Authentication failed. Please verify your Admin Service ID.",
          );
          setLoading(false);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Authentication error. Please try again.");
        setLoading(false);
      }
    } else if (type === "forgot-password") {
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Registered academic email address is required.");
        setLoading(false);
        return;
      }
      try {
        await authService.resetPassword(email.trim(), "SUBSCRIBER");
        setSuccessMsg(
          "Service ID reset instructions dispatched securely to your academic mailbox.",
        );
        setLoading(false);
      } catch (err: any) {
        setErrorMsg(
          err.message || "Failed to request reset. Please try again.",
        );
        setLoading(false);
      }
    } else {
      // Subscribe / signup onboarding
      if (!email.includes("@")) {
        setErrorMsg("Standard university academic email is required.");
        setLoading(false);
        return;
      }
      if (!fullName || !phone) {
        setErrorMsg("Please specify your Full Name and MoMo billing number.");
        setLoading(false);
        return;
      }

      try {
        setSuccessMsg(
          "Onboarding successful! Connecting securely with Paystack checkout hub...",
        );

        await register({
          email,
          fullName,
          universityId: university, // university state stores selected institution ID
          studentId:
            studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
          phone: phone.replace(/[\s+-]/g, ""),
          gender,
          residence: "Campus Residence",
          level: 100,
          planId: selectedPlanId,
        });
      } catch (err: any) {
        console.error("API Server registration failed:", err);
        setErrorMsg(
          err.response?.data?.message ||
            err.message ||
            "Registration failed. Please try again.",
        );
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-white selection:bg-royal relative overflow-hidden text-left font-sans select-none">
      {/* Decorative Blur Backing */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-royal/4 filter blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-golden/4 filter blur-3xl rounded-full" />

      <div className="max-w-md w-full mx-auto px-6 py-10 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            onClick={() => navigate("landing")}
            className="inline-flex items-center space-x-2 cursor-pointer focus:outline-none"
          >
            <AppLogo size="lg" textColor="text-navy" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#2563EB] font-bold block mt-1 leading-none">
            Stay Connected. Stay Protected.
          </span>
        </div>

        {/* Dynamic Card Container */}
        <div
          className={`bg-white border border-slate-200 p-6 sm:p-8 space-y-5 ${type === "login" || type === "admin-login" ? "rounded-none shadow-none" : "rounded-3xl shadow-none"}`}
        >
          <div className="text-left border-b border-slate-100 pb-3 font-sans">
            <h2 className="text-md font-bold text-[#00183D] capitalize">
              {type === "login" && "Access Diagnostic Dashboard"}
              {type === "admin-login" && "Access Diagnostic Dashboard"}
              {type === "register" && "Onboarding & Protection Cover"}
              {type === "forgot-password" && "Retrieve Support Key"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              {type === "login" &&
                "Integrate with university diagnostic resources."}
              {type === "admin-login" &&
                "Enter admin secret code to authenticate root privileges."}
              {type === "register" &&
                "Enter your coordinates to prepare secure payment protection."}
              {type === "forgot-password" &&
                "Enter your academic email address below."}
            </p>
          </div>

          {/* Active plan banner display under register flow */}
          {type === "register" && plans.length > 0 && (
            <div className="bg-royal/5 border border-royal/10 p-3 rounded-xl flex items-center justify-between mb-4 mt-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-royal" />
                <div>
                  <span className="text-[11px] font-bold text-navy block font-sans">
                    {planName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium font-sans">
                    Payment via Paystack
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-navy font-sans">
                  {planPrice}
                </span>
                <span className="text-[9px] text-slate-500 block uppercase font-mono">
                  / Semester
                </span>
              </div>
            </div>
          )}
          {type === "register" && plans.length === 0 && (
            <div className="bg-slate-50 border border-dashed border-slate-300 p-3 rounded-xl text-center mb-4 mt-2">
              <span className="text-xs text-slate-500 font-medium font-sans">
                No coverage plans available at the moment.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields */}
            {type === "register" && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="E.g. Emmanuel Boateng Mills"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="E.g. 10928374"
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                      MoMo Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0244123456"
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:border-royal cursor-pointer font-sans"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    University Hub Option
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:border-royal cursor-pointer font-sans"
                  >
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Set Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Optional Expandable Device section */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
                  <button
                    type="button"
                    onClick={() => setShowDeviceFields(!showDeviceFields)}
                    className="w-full px-3.5 py-3.5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Laptop className="w-4 h-4 text-royal" />
                      <div>
                        <span className="font-bold text-navy block">
                          Add Device Details Initially
                        </span>
                        <span className="text-[9px] text-slate-400 block">
                          Complete enrollment early to skip dashboard sweeps
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${showDeviceFields ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showDeviceFields && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 border-t border-slate-100 bg-white space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
                              Laptop Brand
                            </label>
                            <input
                              type="text"
                              value={deviceBrand}
                              onChange={(e) => setDeviceBrand(e.target.value)}
                              placeholder="E.g. Asus, Apple, HP"
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
                              Device Model
                            </label>
                            <input
                              type="text"
                              value={deviceModel}
                              onChange={(e) => setDeviceModel(e.target.value)}
                              placeholder="E.g. ZenBook 14, Pro"
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
                            Serial Tag Code
                          </label>
                          <input
                            type="text"
                            value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)}
                            placeholder="Optional serial lookup"
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {type === "admin-login" ? (
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Admin Secret Code / Service ID
                </label>
                <div className="relative font-sans">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Admin Service ID"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all rounded-none"
                  />
                </div>
              </div>
            ) : type === "login" ? (
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Secret Code
                </label>
                <div className="relative font-sans">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Secret Code"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all rounded-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Academic Email
                </label>
                <div className="relative font-sans">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Error messaging portals */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 border border-red-200 text-red-700 text-[10px] p-2.5 rounded-xl flex items-start space-x-2"
                >
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] p-2.5 rounded-xl flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {type === "register" && (
              <p className="text-[10px] text-slate-450 text-center font-sans mt-2 mb-3 leading-normal">
                By subscribing, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => navigate("service-agreement")}
                  className="text-royal font-semibold hover:underline cursor-pointer"
                >
                  Service Agreement
                </button>
                .
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-6 text-xs font-bold text-white bg-[#00183D] hover:bg-[#1E293B] transition-all tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 pointer-events-auto cursor-pointer ${
                type === "login" || type === "admin-login"
                  ? "rounded-none shadow-none"
                  : "rounded-full shadow-md shadow-royal/10"
              }`}
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  {type === "register" ? (
                    <Coins className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  <span>
                    {type === "login" && "Unlock Dashboard"}
                    {type === "admin-login" && "Unlock Dashboard"}
                    {type === "register" && `Subscribe & Pay ${planPrice}`}
                    {type === "forgot-password" && "Initialize Recovery"}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Bottom redirection choices */}
          <div className="pt-1 flex justify-between items-center text-[10px] text-slate-400 font-medium font-sans">
            {(type === "login" || type === "admin-login") && (
              <>
                {type === "login" && (
                  <button
                    onClick={() => navigate("register")}
                    className="hover:text-royal transition-colors cursor-pointer"
                  >
                    Create new account
                  </button>
                )}
                {type === "admin-login" && <span />}
                <button
                  onClick={() => navigate("forgot-password")}
                  className="hover:text-royal transition-colors cursor-pointer"
                >
                  Forgot support key?
                </button>
              </>
            )}
            {type === "register" && (
              <button
                onClick={() => navigate("login")}
                className="hover:text-royal transition-colors mx-auto cursor-pointer"
              >
                Already registered? Log in.
              </button>
            )}
            {type === "forgot-password" && (
              <button
                onClick={() => navigate("login")}
                className="hover:text-royal transition-colors mx-auto cursor-pointer"
              >
                Back to login workspace
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
