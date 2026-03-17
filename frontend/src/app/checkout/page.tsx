'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/Store';
import { clearCart } from '../../redux/slices/CartSlice';
import axios from 'axios';
import { CreditCard, Truck, ShieldCheck, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to complete checkout");
      return;
    }
    setLoading(true);

    try {
      if (paymentMethod === 'stripe') {
        const res = await axios.post(`${API_URL}/payments/stripe/create-session`, { items }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.href = res.data.url;
      } else {
        const res = await axios.post(`${API_URL}/payments/paypal/create-order`, { amount: total }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Simplification: In a real app, you'd use the PayPal SDK button.
        // For this migration, we'll simulate a success or redirect.
        alert("PayPal Checkout initiated. ID: " + res.data.id);
        setSuccess(true);
        dispatch(clearCart());
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-green-100">
          <CheckCircle2 size={80} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Order Placed!</h1>
          <p className="text-gray-500 mb-8">Thank you for your purchase. We've sent a confirmation email to {user?.email}.</p>
          <Link href="/shop" className="block w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-10 uppercase tracking-tighter">Secure Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Info & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-indigo-600" size={20} /> Shipping Address
              </h2>
              <div className="grid gap-4">
                <div className="font-bold text-gray-900">{user?.name}</div>
                <div className="text-gray-600">Please verify your shipping details in your profile settings before proceeding.</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-500" size={20} /> Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <div className="font-black text-blue-600 text-lg italic">Stripe</div>
                  <span className="text-xs text-gray-500">Pay with Card</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}
                >
                  <div className="font-black text-indigo-700 text-lg italic">PayPal</div>
                  <span className="text-xs text-gray-500">Pay with Balance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    <Image src={item.image || '/placeholder.png'} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    <div className="font-bold text-gray-900 text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-3 border-t border-gray-50">
                <span>Total</span>
                <span className="text-indigo-600 font-black">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-gray-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Complete Purchase'}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              <ShieldCheck size={14} className="text-green-500" /> Secure SSL Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
