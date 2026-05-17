"use client"

import { useState } from "react"
import { Building2, Flower2, Home, Phone, Mail, MessageSquare } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

type ViewState = "main" | "contact"

interface LotTypeInfo {
  id: string
  icon: typeof Building2
  titleEn: string
  titleTl: string
  descriptionEn: string
  descriptionTl: string
  price: number
  downPayment?: number
  annualTax: number
  taxNoteEn?: string
  taxNoteTl?: string
  size: string
}

const lotTypes: LotTypeInfo[] = [
  {
    id: "mausoleum",
    icon: Building2,
    titleEn: "Mausoleum",
    titleTl: "Mausoleum",
    descriptionEn: "Above-ground burial structure",
    descriptionTl: "May building ang libing sa ibabaw ng lupa",
    price: 60000,
    downPayment: 15000,
    annualTax: 750,
    size: "1.21m x 2.22m"
  },
  {
    id: "garden",
    icon: Flower2,
    titleEn: "Garden",
    titleTl: "Garden",
    descriptionEn: "Traditional in-ground burial plot",
    descriptionTl: "Tradisyonal na lote ng libing sa ilalim ng lupa",
    price: 5000,
    annualTax: 250,
    size: "24 sqm (6m x 4m)"
  },
  {
    id: "apartment",
    icon: Home,
    titleEn: "Apartment",
    titleTl: "Apartment",
    descriptionEn: "Multi-level niche for remains",
    descriptionTl: "Nakapalapag para sa labi",
    price: 2250,
    annualTax: 250,
    taxNoteEn: "Tax starts after 5 years of burial",
    taxNoteTl: "Ang buwis ay nagsisimula pagkatapos ng 5 taon ng libing",
    size: "Standard niche"
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(price)
}

export function InquireSection() {
  const [viewState, setViewState] = useState<ViewState>("main")
  const { language, t } = useLanguage()

  const phoneNumber = "+63 912 345 6789"
  const email = "admin@anahaocemetery.com"

  // Contact View
  if (viewState === "contact") {
    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <p className="text-sm text-white/80 mb-1">{t("Inquire a Lot", "Magtanong Tungkol sa Lote")}</p>
          <h2 className="text-xl font-bold">{t("Contact Administrator", "Makipag-ugnayan sa Administrator")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {t(
              "Contact the cemetery administrator to inquire about lot reservations",
              "Makipag-ugnayan sa administrator ng sementeryo upang magtanong tungkol sa reserbasyon ng lote"
            )}
          </p>

          {/* Contact Options */}
          <div className="flex flex-col gap-4">
            {/* Call */}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{t("Call Administrator", "Tawagan ang Administrator")}</p>
                <p className="text-sm text-muted-foreground">{t("Speak directly with us", "Makipag-usap direkta sa amin")}</p>
                <p className="text-sm text-[#1a472a] dark:text-[#4ade80] font-medium mt-1">{phoneNumber}</p>
              </div>
            </a>

            {/* SMS */}
            <a
              href={`sms:${phoneNumber.replace(/\s/g, '')}?body=Hi, I would like to inquire about lot reservation at Anahao Public Cemetery.`}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{t("Send SMS", "Magpadala ng SMS")}</p>
                <p className="text-sm text-muted-foreground">{t("Text us your inquiry", "I-text sa amin ang iyong katanungan")}</p>
                <p className="text-sm text-[#1a472a] dark:text-[#4ade80] font-medium mt-1">{phoneNumber}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}?subject=Lot Reservation Inquiry&body=Hello,%0D%0A%0D%0AI would like to inquire about lot reservation at Anahao Public Cemetery.%0D%0A%0D%0APlease contact me regarding the reservation process.%0D%0A%0D%0AThank you.`}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{t("Send Email", "Magpadala ng Email")}</p>
                <p className="text-sm text-muted-foreground">{t("We'll respond within 24 hours", "Sasagutin namin sa loob ng 24 oras")}</p>
                <p className="text-sm text-[#1a472a] dark:text-[#4ade80] font-medium mt-1">{email}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setViewState("main")}
            className="w-full py-3 px-4 rounded-xl border border-[#1a472a] dark:border-[#4ade80] text-[#1a472a] dark:text-[#4ade80] font-semibold hover:bg-[#1a472a]/5 transition-colors"
          >
            {t("Back", "Bumalik")}
          </button>
        </div>
      </div>
    )
  }

  // Main View - Lot Types Display (not buttons)
  return (
    <div className="flex-1 flex flex-col bg-background p-4 min-h-0 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {t("Burial Lot Types", "Mga Uri ng Lote ng Libing")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("Available lot options at Anahao Public Cemetery", "Mga available na opsyon ng lote sa Anahao Public Cemetery")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {lotTypes.map((type) => {
          const Icon = type.icon
          const title = language === "en" ? type.titleEn : type.titleTl
          const description = language === "en" ? type.descriptionEn : type.descriptionTl
          return (
            <div
              key={type.id}
              className="w-full flex items-start gap-4 p-4 bg-card rounded-xl border border-border"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mb-2">{description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[#1a472a] dark:text-[#4ade80] font-bold">{formatPrice(type.price)}</span>
                  <span className="text-xs text-muted-foreground">• {type.size}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact Us Button */}
      <div className="mt-6">
        <button
          onClick={() => setViewState("contact")}
          className="w-full py-3 px-4 rounded-xl bg-[#1a472a] text-white font-semibold hover:bg-[#1a472a]/90 transition-colors"
        >
          {t("Contact Us", "Makipag-ugnayan sa Amin")}
        </button>
      </div>
    </div>
  )
}
