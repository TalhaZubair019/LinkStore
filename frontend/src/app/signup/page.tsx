"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/AuthSlice";
import {
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingLoading, setVerifyingLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const urlEmail = searchParams.get("email");
  const isNotVerified = searchParams.get("notVerified") === "true";

  // Password requirements check
  const getRequirements = (pass: string) => [
    { label: "At least 8 characters", met: pass.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(pass) },
    { label: "One number", met: /[0-9]/.test(pass) },
    {
      label: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    },
  ];

  const requirements = getRequirements(formData.password);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsExpired(true);
      setError("Verification code has expired. Please request a new one.");
    }
    return () => clearInterval(timer);
  }, [isVerifying, timeLeft]);

  useEffect(() => {
    if (urlEmail) {
      setFormData((prev) => ({ ...prev, email: urlEmail }));
      if (isNotVerified) {
        setIsVerifying(true);
        setSuccessMessage("Please verify your email to continue.");
      }
    }
  }, [urlEmail, isNotVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.some((r) => !r.met)) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${apiUrl}/auth/signup`, formData);
      setSuccessMessage(res.data.message);
      setIsVerifying(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isExpired) return;
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setVerifyingLoading(true);
    setError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${apiUrl}/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      const data = res.data;
      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push(redirect || "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setVerifyingLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && isVerifying) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${apiUrl}/auth/resend-otp`, {
        email: formData.email,
      });
      setSuccessMessage("A new verification code has been sent.");
      setOtp("");
      setTimeLeft(300);
      setIsExpired(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Resend failed.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-200">
            L
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            LinkStore
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {isVerifying ? "Verify your email" : "Create your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
          {isVerifying ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-orange-500 border border-orange-100">
                  <KeyRound size={36} />
                </div>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit code sent to <br />
                  <span className="font-bold text-gray-800">
                    {formData.email}
                  </span>
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 text-center">
                  {error}
                </div>
              )}
              {successMessage && !error && (
                <div className="p-3 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-100 text-center">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="absolute inset-0 opacity-0 cursor-default"
                    autoFocus
                  />
                  <div
                    className="flex justify-between gap-2 max-w-[300px] mx-auto cursor-text"
                    onClick={() => otpInputRef.current?.focus()}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-11 h-14 border-2 rounded-xl text-2xl font-black flex items-center justify-center transition-all ${otp[i] ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-gray-200 bg-gray-50 text-gray-300"}`}
                      >
                        {otp[i] || ""}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs font-bold text-gray-400">
                  {timeLeft > 0 ? (
                    <span
                      className={
                        timeLeft < 60 ? "text-red-500 animate-pulse" : ""
                      }
                    >
                      Expires in {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  ) : (
                    <span className="text-red-600">Code expired</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifyingLoading}
                  className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                >
                  {verifyingLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Verify Code <ShieldCheck size={18} />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2"
                  >
                    {resendLoading ? (
                      <RefreshCw className="animate-spin h-4 w-4" />
                    ) : (
                      <RefreshCw size={14} />
                    )}{" "}
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVerifying(false)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  >
                    <ArrowLeft size={12} /> Change Email
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50"
                  placeholder="Alexander Pierce"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="mt-4 space-y-1.5 ml-1">
                  {requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] font-bold flex items-center gap-2 ${req.met ? "text-green-500" : "text-gray-300 transition-colors"}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${req.met ? "bg-green-500 shadow-sm" : "bg-gray-200"}`}
                      />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center py-3.5 px-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      CREATE ACCOUNT <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-gray-500">Already have an account?</span>{" "}
            <Link
              href="/login"
              className="font-bold text-orange-600 hover:text-orange-500"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
