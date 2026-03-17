import React from "react";
import { Wallet, Banknote } from "lucide-react";

interface PaymentOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

function PaymentOption({
  id,
  label,
  icon,
  description,
  isSelected,
  onSelect,
}: PaymentOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            isSelected ? "border-blue-600 dark:border-blue-500" : "border-slate-400 dark:border-slate-600"
          }`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
          )}
        </div>
        {icon}
        <span className="font-bold text-slate-800 dark:text-slate-200">{label}</span>
      </div>
      {isSelected && (
        <div className="mt-3 ml-8 text-sm text-slate-500 dark:text-slate-400 animate-in fade-in slide-in-from-top-1 transition-colors">
          {description}
        </div>
      )}
    </div>
  );
}

interface PaymentSectionProps {
  data: any;
  update: (data: any) => void;
}

export default function PaymentSection({ data, update }: PaymentSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 transition-colors">Payment options</h2>
      <div className="space-y-3">
        <PaymentOption
          id="paypal"
          label="PayPal"
          icon={<Wallet className="text-slate-600 dark:text-slate-400" size={20} />}
          description="Pay securely using your PayPal account."
          isSelected={data.paymentMethod === "paypal"}
          onSelect={() => update({ paymentMethod: "paypal" })}
        />
        <PaymentOption
          id="stripe"
          label="Credit / Debit Card (International)"
          icon={<Wallet className="text-slate-600 dark:text-slate-400" size={20} />}
          description="Pay securely using your international credit or debit card."
          isSelected={data.paymentMethod === "stripe"}
          onSelect={() => update({ paymentMethod: "stripe" })}
        />

        <PaymentOption
          id="cod"
          label="Cash on Delivery"
          icon={<Banknote className="text-slate-600 dark:text-slate-400" size={20} />}
          description="Pay with cash upon delivery."
          isSelected={data.paymentMethod === "cod"}
          onSelect={() => update({ paymentMethod: "cod" })}
        />
      </div>
    </section>
  );
}
