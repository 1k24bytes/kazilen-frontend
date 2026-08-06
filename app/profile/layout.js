"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function ProfileLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
