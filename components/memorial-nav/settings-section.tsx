"use client"

import { useState, useEffect } from "react"
import { Moon, Globe, Info, ChevronLeft, Check, Sun, Smartphone } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"

type SettingsView = "main" | "appearance" | "language" | "about"

export function SettingsSection() {
  const [currentView, setCurrentView] = useState<SettingsView>("main")
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleBack = () => {
    setCurrentView("main")
  }

  const getAppearanceDescription = () => {
    if (!mounted) return ""
    if (theme === "light") return "Light mode"
    if (theme === "dark") return "Dark mode"
    return "System default"
  }

  // Main Settings View
  if (currentView === "main") {
    const settingsOptions = [
      {
        icon: Moon,
        title: "Appearance",
        description: getAppearanceDescription(),
        view: "appearance" as SettingsView
      },
      {
        icon: Globe,
        title: "Language",
        description: language === "en" ? "English" : "Tagalog",
        view: "language" as SettingsView
      },
      {
        icon: Info,
        title: "About",
        description: "App version and info",
        view: "about" as SettingsView
      },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background p-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Customize your app experience
          </p>
        </div>

        {/* Settings Options */}
        <div className="space-y-2">
          {settingsOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                key={index}
                onClick={() => setCurrentView(option.view)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/30 transition-colors text-left"
              >
                <div className="relative w-10 h-10 flex items-center justify-center bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-full">
                  <Icon className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </button>
            )
          })}
        </div>

        {/* App Version */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-sm text-muted-foreground">MemorialNav v1.0.0</p>
        </div>
      </div>
    )
  }

  // Appearance View
  if (currentView === "appearance") {
    const themeOptions = [
      { value: "light", label: t("Light", "Maliwanag"), icon: Sun },
      { value: "dark", label: t("Dark", "Madilim"), icon: Moon },
      { value: "system", label: t("System", "System"), icon: Smartphone },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Appearance", "Hitsura")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t("Choose how the app looks to you", "Piliin kung paano lalabas ang app sa iyo")}
          </p>

          <div className="space-y-2">
            {themeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = mounted && theme === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? "bg-[#e8f0e8] dark:bg-[#1a472a]/30 border-[#1a472a] dark:border-[#4ade80]"
                      : "bg-card border-border hover:border-[#1a472a]/30"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    isSelected ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "" : "text-[#1a472a] dark:text-[#4ade80]"}`} />
                  </div>
                  <span className="flex-1 font-medium text-foreground text-left">{option.label}</span>
                  {isSelected && <Check className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Language View
  if (currentView === "language") {
    const languageOptions = [
      { value: "en", label: "English", native: "English" },
      { value: "tl", label: "Tagalog", native: "Tagalog" },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Language", "Wika")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t("Select your preferred language", "Piliin ang iyong gustong wika")}
          </p>

          <div className="space-y-2">
            {languageOptions.map((option) => {
              const isSelected = language === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setLanguage(option.value as "en" | "tl")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? "bg-[#e8f0e8] dark:bg-[#1a472a]/30 border-[#1a472a] dark:border-[#4ade80]"
                      : "bg-card border-border hover:border-[#1a472a]/30"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    isSelected ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
                  }`}>
                    <Globe className={`w-5 h-5 ${isSelected ? "" : "text-[#1a472a] dark:text-[#4ade80]"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.native}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // About View
  if (currentView === "about") {
    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("About", "Tungkol sa")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* App Info */}
          <div className="flex flex-col items-center mb-8 pt-4">
            <div className="w-20 h-20 bg-[#1a472a] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-3xl font-bold">M</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">MemorialNav</h3>
            <p className="text-sm text-muted-foreground">{t("Version", "Bersyon")} 1.0.0</p>
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl border border-border p-4 mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "MemorialNav helps you navigate and find grave locations in Anahao Public Cemetery. Search for loved ones, get directions, and save bookmarks for future visits.",
                "Ang MemorialNav ay tumutulong sa iyo na mag-navigate at maghanap ng lokasyon ng libingan sa Anahao Public Cemetery. Maghanap ng mga mahal sa buhay, kumuha ng direksyon, at mag-save ng mga bookmark para sa mga susunod na pagbisita."
              )}
            </p>
          </div>

          {/* Info Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
              <span className="text-sm text-muted-foreground">{t("Developer", "Developer")}</span>
              <span className="text-sm font-medium text-foreground">Memorial Nav Team</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
              <span className="text-sm text-muted-foreground">{t("Last Updated", "Huling Na-update")}</span>
              <span className="text-sm font-medium text-foreground">May 2025</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
