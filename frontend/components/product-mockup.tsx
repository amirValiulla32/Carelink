"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface ProductMockupProps {
  children: ReactNode
  variant?: "browser" | "mobile" | "tablet"
  className?: string
}

export function ProductMockup({ children, variant = "browser", className = "" }: ProductMockupProps) {
  if (variant === "browser") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative rounded-xl border-4 border-slate-300 bg-slate-100 shadow-2xl ${className}`}
      >
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 border-b border-slate-300 bg-slate-200 px-4 py-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
          <div className="ml-4 flex-1 rounded bg-white px-3 py-1 text-xs text-slate-400">
            carelink.app
          </div>
        </div>
        {/* Content */}
        <div className="overflow-hidden bg-white">{children}</div>
      </motion.div>
    )
  }

  if (variant === "mobile") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative mx-auto w-full max-w-[320px] rounded-[2.5rem] border-[14px] border-slate-900 bg-slate-900 shadow-2xl ${className}`}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900"></div>
        {/* Screen */}
        <div className="overflow-hidden rounded-[1.25rem] bg-white">
          {children}
        </div>
      </motion.div>
    )
  }

  // Tablet variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative mx-auto w-full max-w-[600px] rounded-3xl border-[16px] border-slate-800 bg-slate-800 shadow-2xl ${className}`}
    >
      <div className="overflow-hidden rounded-2xl bg-white">{children}</div>
    </motion.div>
  )
}
