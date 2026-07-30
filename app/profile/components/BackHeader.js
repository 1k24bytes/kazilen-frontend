'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackHeader({ title = 'Account Settings' }) {
  const router = useRouter()

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 shadow-2xs">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      </div>
    </div>
  )
}
