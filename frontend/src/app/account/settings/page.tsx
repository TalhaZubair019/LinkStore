"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { login } from "@/redux/slices/AuthSlice";
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Shield, 
  Save, 
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Token is handled by cookies in backend middleware
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(login({ user: { ...user, name: formData.name }, token: "" })); // Sync Redux
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 font-medium">Manage your personal information and account security</p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-10">
          {/* Avatar Section */}
          <div className="flex items-center gap-8">
             <div className="relative group">
                <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-3xl border border-indigo-100 shadow-inner group-hover:bg-indigo-100 transition-colors">
                   {formData.name ? formData.name[0].toUpperCase() : "U"}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                   <Camera size={14} />
                </button>
             </div>
             <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Your Avatar</h3>
                <p className="text-xs text-gray-500 font-medium max-w-[240px]">High-resolution JPG, PNG or GIF. Max size of 800K.</p>
             </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                   <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all"
                        placeholder="Your Name"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-12 py-4 text-sm font-bold text-gray-400 cursor-not-allowed outline-hidden"
                      />
                   </div>
                   <p className="text-[10px] text-indigo-500 font-bold ml-1 uppercase tracking-widest flex items-center gap-1">
                      <Shield size={10} /> Verified Primary Email
                   </p>
                </div>
             </div>

             <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  Save Changes
                </button>
                
                {success && (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in slide-in-from-left-2">
                     <CheckCircle2 size={18} /> Profile updated!
                  </div>
                )}
             </div>
          </form>
        </div>
      </div>

      {/* Security Section Placeholder */}
      <div className="bg-linear-to-br from-gray-50 to-white rounded-[32px] p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
         <Shield className="text-gray-200 mb-4" size={48} />
         <h3 className="text-lg font-black text-gray-400 mb-1">Account Security</h3>
         <p className="text-sm text-gray-400 font-medium mb-6">Password and Two-Factor Authentication settings are coming soon.</p>
         <button disabled className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs uppercase tracking-widest cursor-not-allowed">
            Manage Security
         </button>
      </div>
    </div>
  );
}
