import React from "react";

interface ContactSectionProps {
  email: string;
  update: (data: any) => void;
  isReadOnly: boolean;
}

export default function ContactSection({
  email,
  update,
  isReadOnly,
}: ContactSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 transition-colors">
        Contact information
      </h2>
      <input
        type="email"
        required
        readOnly={isReadOnly}
        placeholder="Email address"
        className={`w-full border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors ${
          isReadOnly ? "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" : "bg-white dark:bg-slate-900"
        }`}
        value={email}
        onChange={(e) => update({ email: e.target.value })}
      />
      {!isReadOnly && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 transition-colors">
          You are currently checking out as a guest
        </p>
      )}
    </section>
  );
}
