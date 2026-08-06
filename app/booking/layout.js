"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function BookingLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
