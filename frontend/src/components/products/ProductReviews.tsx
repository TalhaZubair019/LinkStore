"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";

import {
  Star,
  Loader2,
  User,
  Trash2,
  Edit2,
  MessageSquare,
} from "lucide-react";

import { RootState } from "../../redux/Store";


interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  isEdited: boolean;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/reviews/product/${productId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        const res = await axios.put(
          `${API_URL}/reviews/${editingId}`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setReviews(reviews.map((r) => (r._id === editingId ? res.data : r)));
        setEditingId(null);
      } else {
        const res = await axios.post(
          `${API_URL}/reviews`,
          { productId, rating, comment },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setReviews([res.data, ...reviews]);
      }
      setComment("");
      setRating(5);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({
      top: document.getElementById("review-form")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-8 mt-10" id="reviews">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <MessageSquare className="text-indigo-600" size={24} />
        Customer Reviews ({reviews.length})
      </h3>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Review Form */}
        <div
          id="review-form"
          className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit"
        >
          <h4 className="font-bold mb-4">
            {editingId ? "Edit Your Review" : "Write a Review"}
          </h4>
          {token ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          (hoveredStar || rating) >= star
                            ? "fill-indigo-500 text-indigo-600"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <div className="flex gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setComment("");
                      setRating(5);
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : editingId ? (
                    "Update Review"
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 mb-4">
                You must be logged in to leave a review.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition-all"
              >
                Log In
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      {review.userName?.[0] || "U"}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {review.userName}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase font-black">
                        {new Date(review.createdAt).toLocaleDateString()}
                        {review.isEdited && (
                          <span className="ml-2 text-indigo-600">Edited</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>
                {user && (user as any)._id === (review.userId as any)._id && (
                  <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
