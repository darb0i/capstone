"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="bg-[#1a472a] text-white px-4 py-3 relative z-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">MemorialNav</h1>
          <p className="text-xs text-white/80">{t("Find & Honor", "Hanapin at Parangalan")}</p>
        </div>
      </div>
    </header>
  )
}
