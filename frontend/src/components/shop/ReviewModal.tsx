"use client";

import React, { useState } from "react";
import { Star, X, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    type: "product" | "vendor";
    id: string | number;
    name: string;
    vendorId?: string;
  } | null;
  user: any;
}

export default function ReviewModal({ isOpen, onClose, target, user }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const endpoint = target.type === "vendor" ? "/api/public/reviews/vendor" : "/api/public/reviews";
      const payload = {
        ...(target.type === "product" ? { productId: target.id } : { vendorId: target.id }),
        rating,
        comment,
        userId: user?.id || "guest",
        userName: user?.name || "Verified Buyer",
        userImage: user?.image || ""
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setRating(0);
          setComment("");
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Review submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {success ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Thank You!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <>
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {target.type === "vendor" ? "Rate Seller" : "Review Product"}
                  </h2>
                  <p className="text-sm font-bold text-slate-400 mt-1">{target.name}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Star Rating */}
                <div className="space-y-4 text-center">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Step 1: Assign Stars</label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <button
                        key={index}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(index)}
                        className="transition-all hover:scale-125 active:scale-95"
                      >
                        <Star
                          size={40}
                          fill={(hover || rating) >= index ? "currentColor" : "none"}
                          className={(hover || rating) >= index ? "text-amber-500" : "text-slate-200 dark:text-slate-700"}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-black text-amber-500 uppercase tracking-widest h-4">
                    {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : rating === 5 ? "Excellent!" : ""}
                  </p>
                </div>

                {/* Comment */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Step 2: Leave a Comment</label>
                  <textarea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-4xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all dark:text-white dark:placeholder-slate-600 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-slate-900/10"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-white dark:border-t-slate-900 animate-spin rounded-full" />
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
