"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleContinue = async () => {
    if (!acceptedTerms) {
      alert("Please accept Terms of Condition");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: `91${phone}` }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to send OTP: ${errorData.detail || "Server error"}`);
        return;
      }

      router.push(`/verify?phone=${encodeURIComponent(phone)}`);
    } catch (e) {
      alert(`Failed to connect to server: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneInput = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) setPhone(digitsOnly);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-secondary relative">
      <h1 className="text-4xl font-bold text-primary mb-2">Kazilen</h1>

      <div className="mt-8 w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-foreground mb-6">
          Login <span className="text-gray-500 font-normal">or Create Account</span>
        </p>

        <label className="block text-sm font-medium text-foreground mb-2">
          Enter mobile number
        </label>

        <div className="flex items-center border border-gray-300 rounded-xl mb-6 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <span className="px-4 text-gray-500 font-medium bg-gray-50 border-r border-gray-300 h-full py-3">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            pattern="\d*"
            placeholder="9876543210"
            value={phone}
            onChange={handlePhoneInput}
            className="w-full px-4 py-3 focus:outline-none text-base"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={loading || phone.length !== 10}
          className={`w-full text-white font-semibold py-3 rounded-xl transition ${
            loading || phone.length !== 10
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </div>

      <div className="flex items-start gap-2 mt-6 max-w-sm">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 h-4 w-4 accent-primary cursor-pointer rounded border-gray-300"
        />

        <label
          htmlFor="terms"
          className="text-xs text-gray-600 leading-snug"
        >
          I agree to the{" "}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
          >
            Terms of Conditions.
          </button>
        </label>
      </div>
    </div>
  );
}
