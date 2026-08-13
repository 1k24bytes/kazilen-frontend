'use client'

import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ff8a4c] flex items-center justify-center text-white font-extrabold text-base">
                K
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Kazilen</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nagpur&apos;s most trusted platform for instant, background-verified home services and repair professionals.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#ff8a4c]">
              <ShieldCheck size={16} />
              <span className="font-semibold">100% Satisfaction Guaranteed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Popular Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-[#ff8a4c] transition">Electrician Services</Link></li>
              <li><Link href="/" className="hover:text-[#ff8a4c] transition">Fan Repair & Installation</Link></li>
              <li><Link href="/" className="hover:text-[#ff8a4c] transition">Switch Board Repair</Link></li>
              <li><Link href="/" className="hover:text-[#ff8a4c] transition">Inverter & MCB Maintenance</Link></li>
              <li><Link href="/" className="hover:text-[#ff8a4c] transition">Light & Appliance Fitting</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/profile" className="hover:text-[#ff8a4c] transition">My Account</Link></li>
              <li><Link href="/login" className="hover:text-[#ff8a4c] transition">Customer Login</Link></li>
              <li><Link href="/register" className="hover:text-[#ff8a4c] transition">Join as Partner</Link></li>
              <li><Link href="/login/TermsOfCondition" className="hover:text-[#ff8a4c] transition">Terms & Conditions</Link></li>
              <li><Link href="/profile" className="hover:text-[#ff8a4c] transition">Help & Support</Link></li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Coverage</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#ff8a4c] shrink-0 mt-0.5" />
                <span>Nagpur, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#ff8a4c] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-[#ff8a4c] shrink-0" />
                <span>support@kazilen.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Kazilen Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Nagpur with <Heart size={12} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
