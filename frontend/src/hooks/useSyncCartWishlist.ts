'use client';

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { RootState } from '../redux/Store';
import { initializeCart } from '../redux/slices/CartSlice';
import { initializeWishlist } from '../redux/slices/WishlistSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useSyncCartWishlist = () => {
  const dispatch = useDispatch();
  const { cart, auth, wishlist } = useSelector((state: RootState) => ({
    cart: state.cart.items,
    auth: state.auth,
    wishlist: state.wishlist.items
  }));

  const isInitialMount = useRef(true);
  const prevAuthToken = useRef<string | null>(null);

  // Load from backend on login
  useEffect(() => {
    if (auth.token && auth.token !== prevAuthToken.current) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${API_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
          if (res.data.cart) dispatch(initializeCart(res.data.cart));
          if (res.data.wishlist) dispatch(initializeWishlist(res.data.wishlist));
        } catch (err) {
          console.error("Failed to fetch user profile for sync:", err);
        }
      };
      fetchProfile();
      prevAuthToken.current = auth.token;
    }
  }, [auth.token, dispatch]);

  // Sync cart to backend on change
  useEffect(() => {
    if (isInitialMount.current) return;
    if (!auth.token) return;

    const syncCart = async () => {
      try {
        await axios.post(`${API_URL}/user/cart`, { cart }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    };

    const timeoutId = setTimeout(syncCart, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [cart, auth.token]);

  // Sync wishlist to backend on change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!auth.token) return;

    const syncWishlist = async () => {
      try {
        await axios.post(`${API_URL}/user/wishlist`, { wishlist }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
      } catch (err) {
        console.error("Failed to sync wishlist:", err);
      }
    };

    const timeoutId = setTimeout(syncWishlist, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [wishlist, auth.token]);
};
