"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { ArrowLeft } from "lucide-react";

function VerifyOtpClient() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone");

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const handleBack = () => router.back();

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otpDigits.join("");

    if (fullOtp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: `91${phone}`,
          otp: fullOtp,
          role: "customer"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Verification failed");
        return;
      }

      if (data.status === "needs_registration") {
        router.push(`/register?phone=${encodeURIComponent(phone || "")}`);
      } else if (data.status === "success" && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        router.push("/");
      }
    } catch (e) {
      alert(`OTP verification failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendEnabled) return;

    try {
      setResending(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: `91${phone}` }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }

      setSeconds(30);
      setResendEnabled(false);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (e) {
      alert(`Failed to resend OTP: ${e.message}`);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (seconds <= 0) {
      setResendEnabled(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${min.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-secondary px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={handleBack} className="mb-6 text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">Verify OTP</h1>

        <p className="text-sm text-gray-600 mb-8">
          {phone ? (
            <>
              We sent an OTP to <span className="font-semibold text-foreground">+91 {phone}</span>.
            </>
          ) : (
            "An OTP has been sent to your mobile."
          )}
        </p>

        <div className="flex justify-between gap-2 mb-8">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-11 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otpDigits.join("").length !== 6}
          className={`w-full mb-6 text-white font-semibold py-3 rounded-xl transition ${
            loading || otpDigits.join("").length !== 6
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
          <span className="text-gray-600">
            Did not get OTP?{" "}
            <button
              disabled={!resendEnabled || resending}
              onClick={handleResend}
              className={`font-medium ml-1 transition-colors ${
                resendEnabled ? "text-primary hover:underline" : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {resending ? "Resending…" : "Resend"}
            </button>
          </span>
          <span className="font-mono font-medium text-gray-500">{formatTime(seconds)}</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary flex items-center justify-center">Loading...</div>}>
      <VerifyOtpClient />
    </Suspense>
  );
}
