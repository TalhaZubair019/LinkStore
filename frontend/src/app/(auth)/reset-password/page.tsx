"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getMissingRequirements = (pass: string) => {
    const requirements = [
      { id: "length", label: "At least 8 characters", met: pass.length >= 8 },
      { id: "upper", label: "One uppercase letter", met: /[A-Z]/.test(pass) },
      { id: "number", label: "One number", met: /[0-9]/.test(pass) },
      {
        id: "special",
        label: "One special character",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      },
    ];
    return requirements;
  };

  const [passwordRequirements, setPasswordRequirements] = useState(
    getMissingRequirements(""),
  );

  React.useEffect(() => {
    setPasswordRequirements(getMissingRequirements(formData.password));
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordRequirements.some((req) => !req.met)) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-teal-500" size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Password Reset!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Your password has been successfully updated. Redirecting you to the
          login page...
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Go to Login Now
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30 italic">
          {error}
        </div>
      )}

      {!token && (
        <div className="text-amber-600 dark:text-amber-400 text-sm text-center bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 mb-4 font-medium">
          Invalid or missing reset token. Please request another link.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            disabled={!token}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-11 pr-12 py-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all font-medium disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
            placeholder="8+ chars, uppercase, number & symbol"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="mt-2 space-y-1 ml-1">
          {passwordRequirements.map((req) => (
            <div
              key={req.id}
              className={`text-[10px] font-medium flex items-center gap-1.5 transition-colors ${
                req.met
                  ? "text-teal-500 dark:text-teal-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${
                  req.met
                    ? "bg-teal-500 dark:bg-teal-400"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              />
              {req.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            disabled={!token}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all font-medium disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
            placeholder="Repeat your new password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2 mt-8"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title="Reset Password"
        breadcrumbs={[
          { label: "Login", href: "/login" },
          { label: "Security" },
        ]}
      />

      <div className="relative z-10 pt-10">
        <div className="max-w-7xl mx-auto mt-20 px-4 lg:px-8 pb-32">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center transition-colors">
              New Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8 transition-colors">
              Please enter and confirm your new password below.
            </p>

            <Suspense
              fallback={
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-purple-500" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
