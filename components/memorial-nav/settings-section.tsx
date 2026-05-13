"use client"

import { useState, useEffect } from "react"
import { Moon, Globe, Info, ChevronLeft, Sun, Smartphone } from "lucide-react"
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
    if (theme === "light") return t("Light mode", "Light mode")
    if (theme === "dark") return t("Dark mode", "Dark mode")
    return t("System default", "System default")
  }

  // Main Settings View
  if (currentView === "main") {
    const settingsOptions = [
      {
        icon: Moon,
        title: t("Appearance", "Disenyo"),
        description: getAppearanceDescription(),
        view: "appearance" as SettingsView
      },
      {
        icon: Globe,
        title: t("Language", "Wika"),
        description: language === "en" ? "English" : "Tagalog",
        view: "language" as SettingsView
      },
      {
        icon: Info,
        title: t("About", "Tungkol"),
        description: t("App version and info", "Bersyon at impormasyon ng app"),
        view: "about" as SettingsView
      },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background p-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {t("Settings", "Mga Setting")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("Customize your app experience", "Customize ang iyong karanasan sa app")}
          </p>
        </div>

        {/* Settings Options */}
        <div className="space-y-2 flex-1">
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
    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Appearance", "Disenyo")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {/* Light Mode */}
            <button
              onClick={() => setTheme("light")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                theme === "light"
                  ? "bg-[#1a472a]/10 border-[#1a472a] dark:border-[#4ade80]"
                  : "bg-card border-border hover:border-[#1a472a]/30"
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                theme === "light" ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
              }`}>
                <Sun className={`w-5 h-5 ${theme === "light" ? "text-white" : "text-[#1a472a] dark:text-[#4ade80]"}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{t("Light Mode", "Light Mode")}</p>
                <p className="text-sm text-muted-foreground">{t("Bright colors", "Maliwanag na kulay")}</p>
              </div>
              {theme === "light" && (
                <div className="w-5 h-5 rounded-full bg-[#1a472a] dark:bg-[#4ade80]" />
              )}
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme("dark")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                theme === "dark"
                  ? "bg-[#1a472a]/10 border-[#1a472a] dark:border-[#4ade80]"
                  : "bg-card border-border hover:border-[#1a472a]/30"
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                theme === "dark" ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
              }`}>
                <Moon className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-[#1a472a] dark:text-[#4ade80]"}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{t("Dark Mode", "Dark Mode")}</p>
                <p className="text-sm text-muted-foreground">{t("Easy on the eyes", "Komportable sa mga mata")}</p>
              </div>
              {theme === "dark" && (
                <div className="w-5 h-5 rounded-full bg-[#1a472a] dark:bg-[#4ade80]" />
              )}
            </button>

            {/* System Default */}
            <button
              onClick={() => setTheme("system")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                theme === "system"
                  ? "bg-[#1a472a]/10 border-[#1a472a] dark:border-[#4ade80]"
                  : "bg-card border-border hover:border-[#1a472a]/30"
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                theme === "system" ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
              }`}>
                <Smartphone className={`w-5 h-5 ${theme === "system" ? "text-white" : "text-[#1a472a] dark:text-[#4ade80]"}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{t("System Default", "System Default")}</p>
                <p className="text-sm text-muted-foreground">{t("Follow device settings", "Sumunod sa device settings")}</p>
              </div>
              {theme === "system" && (
                <div className="w-5 h-5 rounded-full bg-[#1a472a] dark:bg-[#4ade80]" />
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Language View
  if (currentView === "language") {
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
          <div className="space-y-3">
            {/* English */}
            <button
              onClick={() => setLanguage("en")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                language === "en"
                  ? "bg-[#1a472a]/10 border-[#1a472a] dark:border-[#4ade80]"
                  : "bg-card border-border hover:border-[#1a472a]/30"
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
                language === "en" ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
              }`}>
                🇬🇧
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">English</p>
                <p className="text-sm text-muted-foreground">{t("English language", "Wikang English")}</p>
              </div>
              {language === "en" && (
                <div className="w-5 h-5 rounded-full bg-[#1a472a] dark:bg-[#4ade80]" />
              )}
            </button>

            {/* Tagalog */}
            <button
              onClick={() => setLanguage("tl")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                language === "tl"
                  ? "bg-[#1a472a]/10 border-[#1a472a] dark:border-[#4ade80]"
                  : "bg-card border-border hover:border-[#1a472a]/30"
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
                language === "tl" ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
              }`}>
                🇵🇭
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Tagalog</p>
                <p className="text-sm text-muted-foreground">{t("Tagalog language", "Wikang Tagalog")}</p>
              </div>
              {language === "tl" && (
                <div className="w-5 h-5 rounded-full bg-[#1a472a] dark:bg-[#4ade80]" />
              )}
            </button>
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
          <h2 className="text-xl font-bold">{t("About", "Tungkol")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* App Info */}
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">MemorialNav</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("Find & Honor", "Hanapin at Parangalan")}
              </p>
              <p className="text-lg font-semibold text-[#1a472a] dark:text-[#4ade80]">v1.0.0</p>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2">{t("About this app", "Tungkol sa app")}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "MemorialNav is a digital guide to help you find and honor the graves of your loved ones at Anahao Public Cemetery.",
                  "MemorialNav ay isang digital na gabay upang tulungan kang maghanap at parangalan ang mga libingan ng iyong mga mahal sa buhay sa Anahao Public Cemetery."
                )}
              </p>
            </div>

            {/* Features */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-3">{t("Features", "Mga Tampok")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t("Interactive cemetery maps", "Interactive na mapa ng sementeryo")}</li>
                <li>• {t("Search deceased records", "Maghanap ng mga nakamatay na tala")}</li>
                <li>• {t("Browse available burial lots", "Tingnan ang mga available na libingan")}</li>
                <li>• {t("Customize appearance and language", "I-customize ang disenyo at wika")}</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2">{t("Contact Us", "Makipag-ugnayan sa Amin")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("For inquiries, please contact:", "Para sa mga katanungan, mangyaring makipag-ugnayan sa:")}
              </p>
              <p className="text-sm font-medium text-[#1a472a] dark:text-[#4ade80] mt-2">+63 912 345 6789</p>
              <p className="text-sm font-medium text-[#1a472a] dark:text-[#4ade80]">admin@anahaocemetery.com</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
