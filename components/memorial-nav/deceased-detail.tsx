"use client"

import { MapPin, Calendar, User, Flower2, ArrowLeft, Navigation } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface DeceasedInfo {
  name: string
  section: string
  birthDate: string
  deathDate: string
  burialDate: string
  age: number
  graveNumber: string
  row: string
  block: string
}

interface DeceasedDetailProps {
  deceased: DeceasedInfo
  onBack: () => void
  onDirections: () => void
}

export function DeceasedDetail({ deceased, onBack, onDirections }: DeceasedDetailProps) {
  const { t } = useLanguage()

  return (
    <div className="flex-1 flex flex-col bg-background min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {t("Burial Information", "Impormasyon sa Libing")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("Memorial details", "Mga detalye ng memorial")}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Deceased Name Card */}
        <div className="bg-[#1a472a] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{deceased.name}</h3>
              <p className="text-sm text-white/80">
                {deceased.age} {t("years old", "taong gulang")}
              </p>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
            <h4 className="font-medium text-foreground">{t("Location", "Lokasyon")}</h4>
          </div>
          <div className="space-y-2 pl-7">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Section", "Section")}</span>
              <span className="font-medium text-foreground">{deceased.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Block", "Block")}</span>
              <span className="font-medium text-foreground">{deceased.block}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Row", "Row")}</span>
              <span className="font-medium text-foreground">{deceased.row}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Grave No.", "Grave No.")}</span>
              <span className="font-medium text-foreground">{deceased.graveNumber}</span>
            </div>
          </div>
        </div>

        {/* Dates Info */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
            <h4 className="font-medium text-foreground">{t("Important Dates", "Mahahalagang Petsa")}</h4>
          </div>
          <div className="space-y-2 pl-7">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Date of Birth", "Petsa ng Kapanganakan")}</span>
              <span className="font-medium text-foreground">{deceased.birthDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Date of Death", "Petsa ng Kamatayan")}</span>
              <span className="font-medium text-foreground">{deceased.deathDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Date of Burial", "Petsa ng Libing")}</span>
              <span className="font-medium text-foreground">{deceased.burialDate}</span>
            </div>
          </div>
        </div>

        {/* Memorial Note */}
        <div className="bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flower2 className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
            <h4 className="font-medium text-foreground">{t("In Loving Memory", "Sa Mapagmahal na Alaala")}</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            {t(
              "Forever in our hearts. May you rest in eternal peace.",
              "Habambuhay sa aming mga puso. Nawa'y mamahinga ka sa walang hanggang kapayapaan."
            )}
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-border flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-[#1a472a] dark:border-[#4ade80] text-[#1a472a] dark:text-[#4ade80] rounded-xl font-medium hover:bg-[#e8f0e8] dark:hover:bg-[#1a472a]/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("Back", "Bumalik")}
        </button>
        <button
          onClick={onDirections}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a472a] text-white rounded-xl font-medium hover:bg-[#143d23] transition-colors"
        >
          <Navigation className="w-5 h-5" />
          {t("Directions", "Direksyon")}
        </button>
      </div>
    </div>
  )
}
