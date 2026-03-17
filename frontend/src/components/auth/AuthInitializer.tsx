"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout, setAuthLoaded } from "@/redux/AuthSlice";
import { initializeCart } from "@/redux/CartSlice";
import { initializeWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import { useRouter } from "next/navigation";
import { X, Crown, ShieldOff, AlertTriangle, LogOut } from "lucide-react";

function AuthInitializer() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const auth = useSelector((state: RootState) => state.auth);

  const [isLoaded, setIsLoaded] = useState(false);
  const isFirstRender = useRef(true);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showDemotionModal, setShowDemotionModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess({ user: data.user, token: "active" }));

          if (data.user.cart && Array.isArray(data.user.cart)) {
            const totalQty = data.user.cart.reduce(
              (acc: number, item: any) => acc + (item.quantity || 1),
              0,
            );
            const totalAmt = data.user.cart.reduce(
              (acc: number, item: any) =>
                acc + item.price * (item.quantity || 1),
              0,
            );

            dispatch(
              initializeCart({
                cartItems: data.user.cart,
                totalQuantity: totalQty,
                totalAmount: totalAmt,
              }),
            );
          }

          if (data.user.wishlist && Array.isArray(data.user.wishlist)) {
            dispatch(initializeWishlist(data.user.wishlist));
          }

          if (data.user.promotionPending) {
            setShowPromotionModal(true);
          } else if (data.user.demotionPending) {
            setShowDemotionModal(true);
          }
        } else if (res.status === 401) {
          const data = await res.json().catch(() => ({}));
          dispatch(logout());
          if (data.isDeleted) {
            router.push("/login?msg=deleted");
          }
        }
      } catch (err) {
        console.warn("Session check skipped due to network error", err);
      } finally {
        setIsLoaded(true);
        dispatch(setAuthLoaded());
      }
    };

    checkSession();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoaded || !auth.isAuthenticated) return;
    if (showPromotionModal || showDemotionModal) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user.promotionPending) {
            setShowPromotionModal(true);
          } else if (data.user.demotionPending) {
            setShowDemotionModal(true);
          }
        } else if (res.status === 401) {
          const data = await res.json().catch(() => ({}));
          dispatch(logout());
          if (data.isDeleted) {
            setShowDeletedModal(true);
          }
        }
      } catch {}
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoaded, auth.isAuthenticated, showPromotionModal, showDemotionModal]);

  useEffect(() => {
    if (!isLoaded || !auth.isAuthenticated) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const syncData = async () => {
      try {
        await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cart.cartItems,
            wishlist: wishlist.items,
          }),
        });
      } catch (error) {
        console.error("Failed to sync data", error);
      }
    };

    const timeoutId = setTimeout(syncData, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart.cartItems, wishlist.items, auth.isAuthenticated, isLoaded]);

  const handleDismiss = async (type: "promotion" | "demotion" | "deleted") => {
    if (type !== "deleted") {
      try {
        await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [type === "promotion" ? "promotionPending" : "demotionPending"]:
              false,
          }),
        });
      } catch {}
    }
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    setShowPromotionModal(false);
    setShowDemotionModal(false);
    setShowDeletedModal(false);
    router.push(type === "deleted" ? "/login?msg=deleted" : "/login");
  };

  if (!showPromotionModal && !showDemotionModal && !showDeletedModal)
    return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <button
          onClick={() =>
            handleDismiss(
              showDeletedModal
                ? "deleted"
                : showPromotionModal
                  ? "promotion"
                  : "demotion",
            )
          }
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {showPromotionModal ? (
          <>
            <div className="bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600 px-8 pt-10 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
                <Crown size={32} className="text-amber-300" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Congratulations! 🎉
              </h2>
            </div>
            <div className="px-8 py-6 text-center">
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                You have been promoted to{" "}
                <span className="text-purple-600 font-bold">Admin</span>! You
                now have access to the Admin Dashboard.
              </p>
              <p className="text-slate-500 text-xs mt-3">
                Please log in again to activate your new permissions.
              </p>
              <button
                onClick={() => handleDismiss("promotion")}
                className="mt-6 w-full py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-200 text-sm"
              >
                OK
              </button>
            </div>
          </>
        ) : showDemotionModal ? (
          <>
            <div className="bg-linear-to-br from-red-500 via-rose-500 to-orange-500 px-8 pt-10 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
                <ShieldOff size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Access Revoked
              </h2>
            </div>
            <div className="px-8 py-6 text-center">
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                Your <span className="text-red-600 font-bold">Admin</span>{" "}
                access has been revoked by the Super Admin.
              </p>
              <p className="text-slate-500 text-xs mt-3">
                Please log in again to continue as a regular user.
              </p>
              <button
                onClick={() => handleDismiss("demotion")}
                className="mt-6 w-full py-3 bg-linear-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-red-200 text-sm"
              >
                OK
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-linear-to-br from-slate-700 via-slate-800 to-slate-900 px-8 pt-10 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
                <AlertTriangle size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Account Removed
              </h2>
            </div>
            <div className="px-8 py-6 text-center">
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                Your account has been{" "}
                <span className="text-red-600 font-bold">deleted</span> by an
                administrator.
              </p>
              <p className="text-slate-500 text-xs mt-3">
                You have been logged out. For more info, contact support.
              </p>
              <button
                onClick={() => handleDismiss("deleted")}
                className="mt-6 w-full py-3 bg-linear-to-r from-slate-700 to-slate-900 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-slate-200 text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Return to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthInitializer;
