import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full" />
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin relative z-10" />
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
}
