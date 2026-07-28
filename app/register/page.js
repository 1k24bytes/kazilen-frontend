"use client";

import { useState, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function CreateAccountClient() {
  const router = useRouter();
  const params = useSearchParams();
  const phoneFromQuery = params.get("phone");

  const [phoneNo] = useState(phoneFromQuery || "");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({ name: false });
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length > 0 && /^\d{10}$/.test(phoneNo);

  const handleCreateAccount = async () => {
    if (!canSubmit) {
      setTouched({ name: true });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        phone_number: `91${phoneNo}`,
        full_name: name.trim(),
        role: "customer",
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      if (data.status === "success" && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        alert("Account created successfully!");
        router.replace("/");
      }
    } catch (err) {
      alert(`Create failed: ${err?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-foreground">Create Profile</h1>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Phone Number
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-not-allowed">
            <span className="text-gray-400 font-medium mr-2">+91</span>
            <input
              type="tel"
              value={phoneNo}
              readOnly
              className="w-full bg-transparent text-gray-500 focus:outline-none cursor-not-allowed font-medium"
            />
          </div>
          {!/^\d{10}$/.test(phoneNo) && (
            <p className="text-xs text-error mt-2 font-medium">
              Phone number missing. Please go back.
            </p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Full Name <span className="text-error">*</span>
          </label>
          <div className={`border rounded-xl px-4 py-3 transition-colors ${
            touched.name && !name.trim() ? "border-error focus-within:ring-error focus-within:border-error" : "border-gray-300 focus-within:ring-primary focus-within:border-primary"
          } focus-within:ring-2`}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="Enter your full name"
              className="w-full bg-transparent text-foreground focus:outline-none placeholder-gray-400 font-medium"
            />
          </div>
          {touched.name && !name.trim() && (
            <p className="text-xs text-error mt-2 font-medium">Name is required</p>
          )}
        </div>

        <button
          onClick={handleCreateAccount}
          disabled={!canSubmit || loading}
          className={`w-full text-white font-semibold py-3.5 rounded-xl transition ${
            !canSubmit || loading
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary flex items-center justify-center">Loading...</div>}>
      <CreateAccountClient />
    </Suspense>
  );
}
