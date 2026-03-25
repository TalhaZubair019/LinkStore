"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/(store)/products/Toast";
import PageHeader from "@/components/ui/PageHeader";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isEdited?: boolean;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description?: string;
  category?: string;
  badges?: string[];
  reviews?: Review[];
  sku?: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
  vendorId?: string;
  vendorStoreName?: string;
  vendorStoreSlug?: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        const data = await response.json();

        const foundProduct = data.products.find(
          (p: Product) => p.title.toLowerCase().replace(/\s+/g, "-") === slug,
        );

        setProduct(foundProduct || null);

        if (foundProduct) {
          const reviewsResponse = await fetch(
            `/api/public/reviews?productId=${foundProduct.id}`,
          );
          if (reviewsResponse.ok) {
            const fetchedReviews = await reviewsResponse.json();
            setReviews(fetchedReviews);
          } else {
            setReviews(foundProduct?.reviews || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductAndReviews();
      const interval = setInterval(fetchProductAndReviews, 30000);
      return () => clearInterval(interval);
    }
  }, [slug]);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const currentStock = product.stockQuantity ?? 0;
    if (quantity > currentStock) {
      alert(`Sorry, we only have ${currentStock} in stock right now.`);
      setQuantity(currentStock);
      return;
    }

    const priceNumber = parseFloat(
      product.price.toString().replace(/[^0-9.]/g, ""),
    );
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceNumber,
        image: product.image,
        quantity,
      }),
    );
    showToast(`Added ${quantity} ${product.title} to cart!`, "add");
    setAddingToCart(true);
    setTimeout(() => setAddingToCart(false), 700);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const priceNumber = parseFloat(
      product.price.toString().replace(/[^0-9.]/g, ""),
    );
    const wasInWishlist = wishlistItems.some((item) => item.id === product.id);
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: priceNumber,
        image: product.image,
      }),
    );
    if (wasInWishlist) {
      showToast(`${product.title} removed from wishlist`, "remove");
    } else {
      showToast(`${product.title} added to wishlist!`, "add");
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({
      top: document.getElementById("review-form")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/public/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        showToast("Review deleted successfully", "remove");
        if (editingReviewId === reviewId) {
          setEditingReviewId(null);
          setComment("");
          setRating(5);
        }
      } else {
        showToast("Failed to delete review", "remove");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Error connecting to server", "remove");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !product) return;

    const reviewData = {
      userId: user.id,
      userName: user.name || "Customer",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      let response;
      if (editingReviewId) {
        response = await fetch(`/api/public/reviews/${editingReviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review: { ...reviewData, isEdited: true } }),
        });
      } else {
        response = await fetch("/api/public/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            review: { ...reviewData, id: Date.now().toString() },
          }),
        });
      }

      if (response.ok) {
        const savedReview = await response.json();
        if (editingReviewId) {
          setReviews(
            reviews.map((r) => (r.id === editingReviewId ? savedReview : r)),
          );
          showToast("Review updated successfully!", "add");
        } else {
          setReviews([savedReview, ...reviews]);
          showToast("Review submitted successfully!", "add");
        }
        setComment("");
        setRating(5);
        setEditingReviewId(null);
      } else {
        showToast("Failed to save review.", "remove");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      showToast("Error connecting to server.", "remove");
    }
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4 text-center text-slate-800 dark:text-slate-200">
          Loading...
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            Product not found
          </h1>
          <Link
            href="/shop"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Return to shop
          </Link>
        </div>
      </section>
    );
  }

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);
  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title={product.title}
        breadcrumbs={[
          { label: "Shop", href: "/shop" },
          { label: product.title },
        ]}
      />

      <div className="relative z-10">
        <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-16 mt-8 md:mt-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <div className="relative w-full aspect-square bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-colors">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2 transition-colors">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.round(Number(averageRating))
                          ? "fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-slate-400 transition-colors">
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "Review" : "Reviews"})
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors">
                    {product.price}
                  </span>
                </div>
                {(() => {
                  const stock = product.stockQuantity || 0;
                  const threshold = product.lowStockThreshold || 5;
                  if (stock <= 0) {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs rounded-full ring-1 ring-red-500/20 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                        Out of Stock
                      </span>
                    );
                  } else if (stock <= threshold) {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-full ring-1 ring-amber-500/20 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                        Low Stock ({stock} left)
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-full ring-1 ring-emerald-500/20 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        In Stock
                      </span>
                    );
                  }
                })()}
              </div>

              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors">
                {product.description ||
                  "Premium quality product perfect for your needs. Customizable and high-quality printing."}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-black dark:text-white transition-colors">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={
                        !product.stockQuantity || product.stockQuantity === 0
                      }
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 font-medium bg-white dark:bg-slate-900 border-x border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        const maxStock = product.stockQuantity ?? 0;
                        setQuantity(Math.min(maxStock, quantity + 1));
                      }}
                      disabled={
                        !product.stockQuantity ||
                        quantity >= product.stockQuantity
                      }
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-purple-600">
                    Total: $
                    {(
                      parseFloat(
                        product.price.toString().replace(/[^0-9.]/g, ""),
                      ) * quantity
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      addingToCart ||
                      !product.stockQuantity ||
                      product.stockQuantity === 0
                    }
                    className="w-full sm:flex-1 px-6 py-3.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                  >
                    {addingToCart ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    {!product.stockQuantity || product.stockQuantity === 0
                      ? "Out of Stock"
                      : addingToCart
                        ? "Adding..."
                        : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-full transition-all flex items-center justify-center gap-2 ${isInWishlist ? "bg-red-500 text-white hover:bg-red-600 shadow-md" : "border-2 border-gray-300 dark:border-slate-700 text-black dark:text-white hover:border-red-500 dark:hover:border-red-500 hover:text-red-500"}`}
                  >
                    <span>{isInWishlist ? "♥" : "♡"}</span>
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-8 transition-colors">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold">
                    {product.category || "Featured"}
                  </span>
                </div>
                {product.vendorStoreName && (
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {product.vendorStoreName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                            Sold by
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {product.vendorStoreName}
                          </p>
                        </div>
                      </div>
                      {product.vendorStoreSlug && (
                        <Link
                          href={`/store/${product.vendorStoreSlug}`}
                          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-blue-600 dark:text-blue-400 shadow-sm"
                        >
                          Visit Store
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-gray-200 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-10 transition-colors">
              Customer Reviews
            </h2>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
              <div className="order-2 lg:order-1">
                <h3 className="text-xl font-bold mb-6" id="review-form">
                  {editingReviewId ? "Edit Your Review" : "Write a Review"}
                </h3>
                {!isAuthenticated ? (
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30 transition-colors">
                    <p className="mb-4 text-blue-900 dark:text-blue-300 font-medium transition-colors">
                      You must be logged in to leave a review.
                    </p>
                    <Link
                      href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "")}`}
                      className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                    >
                      Log In to Review
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmitReview}
                    className="space-y-5 bg-gray-50 dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors"
                  >
                    <div>
                      <label className="block font-semibold mb-3 text-slate-800 dark:text-slate-200 transition-colors">
                        Overall Rating
                      </label>
                      <div className="flex gap-2">
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
                              size={28}
                              className={
                                (hoveredStar || rating) >= star
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-slate-700"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-3 text-slate-800 dark:text-slate-200 transition-colors">
                        Your Review
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-slate-800 dark:text-slate-200 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        placeholder="What did you like or dislike about this product?"
                      />
                    </div>
                    <div className="flex gap-4">
                      {editingReviewId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReviewId(null);
                            setComment("");
                            setRating(5);
                          }}
                          className="flex-1 px-6 py-4 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-700 transition-all shadow-md"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-slate-900 dark:bg-purple-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-purple-700 transition-all shadow-md"
                      >
                        {editingReviewId ? "Update Review" : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xl font-bold">
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "Review" : "Reviews"}
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full text-sm font-semibold text-yellow-800 dark:text-yellow-400 transition-colors">
                      <Star
                        size={14}
                        className="fill-current text-yellow-500"
                      />
                      {averageRating} Average
                    </div>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12 px-6 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 transition-colors">
                    <Star
                      size={48}
                      className="mx-auto text-gray-300 dark:text-slate-700 mb-4 transition-colors"
                    />
                    <p className="text-gray-500 dark:text-slate-400 font-medium transition-colors">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border shadow-sm transition-all ${editingReviewId === review.id ? "border-blue-500 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30" : "border-gray-100 dark:border-slate-800"}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-semibold text-slate-900 dark:text-white transition-colors">
                            {review.userName}
                          </div>
                          <div className="text-sm text-slate-400 tracking-wide font-medium flex items-center gap-2">
                            {review.isEdited && (
                              <span className="text-[10px] uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 transition-colors">
                                Edited
                              </span>
                            )}
                            {review.date}
                          </div>
                        </div>
                        <div className="flex mb-4 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-200 dark:text-slate-700"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm mb-4 transition-colors">
                          {review.comment}
                        </p>
                        {user && user.id === review.userId && (
                          <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-gray-50 dark:border-slate-800 transition-colors">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
