"use client"

import { useState } from "react"
import { Header } from "@/components/memorial-nav/header"
import { MapSection } from "@/components/memorial-nav/map-section"
import { BottomNavigation } from "@/components/memorial-nav/bottom-navigation"
import { SearchSection } from "@/components/memorial-nav/search-section"
import { InquireSection } from "@/components/memorial-nav/inquire-section"
import { SettingsSection } from "@/components/memorial-nav/settings-section"

interface NavigationTarget {
  name: string
  section: string
  block: string
  row: string
  graveNumber: string
}

export default function MemorialNavApp() {
  const [activeTab, setActiveTab] = useState("maps")
  const [navigationTarget, setNavigationTarget] = useState<NavigationTarget | null>(null)

  const handleNavigateToGrave = (target: NavigationTarget) => {
    setNavigationTarget(target)
    setActiveTab("maps")
  }

  const handleCancelNavigation = () => {
    setNavigationTarget(null)
  }

  return (
    <div className="h-dvh flex flex-col bg-background max-w-md mx-auto shadow-2xl overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "maps" && (
          <MapSection 
            navigationTarget={navigationTarget}
            onCancelNavigation={handleCancelNavigation}
          />
        )}
        {activeTab === "search" && (
          <SearchSection onNavigateToGrave={handleNavigateToGrave} />
        )}
        {activeTab === "lots" && <InquireSection />}
        {activeTab === "settings" && <SettingsSection />}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
