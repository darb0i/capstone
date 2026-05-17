"use client"

import { useState, useRef, useCallback } from "react"
import { Compass, MapPin, Navigation, ZoomIn, ZoomOut, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface NavigationTarget {
  name: string
  section: string
  block: string
  row: string
  graveNumber: string
}

interface MapSectionProps {
  navigationTarget?: NavigationTarget | null
  onCancelNavigation?: () => void
}

export function MapSection({ navigationTarget, onCancelNavigation }: MapSectionProps) {
  const [zoom, setZoom] = useState(1.4)
  const [position, setPosition] = useState({ x: 0, y: 30 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const positionStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1.4)
    setPosition({ x: 0, y: 30 })
  }

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    positionStart.current = { x: position.x, y: position.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [position])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.current.x
    const deltaY = e.clientY - dragStart.current.y
    
    setPosition({
      x: positionStart.current.x + deltaX,
      y: positionStart.current.y + deltaY
    })
  }, [isDragging])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-background min-h-0">
      {/* Cemetery Info Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h2 className="font-semibold text-foreground">{t("Cemetery Map", "Mapa ng Sementeryo")}</h2>
          <p className="text-sm text-[#1a472a] dark:text-[#4ade80]">Anahao Public Cemetery</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center border-2 border-[#1a472a] dark:border-[#4ade80] rounded-lg text-[#1a472a] dark:text-[#4ade80] hover:bg-[#1a472a]/5 transition-colors">
          <Compass className="w-5 h-5" />
          <span className="sr-only">{t("Compass", "Compass")}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-lg">
            <MapPin className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
            <input
              type="text"
              placeholder={t("Search section or grave...", "Maghanap ng seksyon o libingan...")}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-[#1a472a] rounded-lg text-white hover:bg-[#1a472a]/90 transition-colors">
            <Navigation className="w-5 h-5" />
            <span className="sr-only">{t("Navigate", "Mag-navigate")}</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      <div 
        ref={containerRef}
        className="flex-1 relative mx-4 mb-4 rounded-xl overflow-hidden bg-muted min-h-0 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="absolute inset-0 origin-center select-none"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cemetery-map.png"
            alt={t(
              "Anahao Public Cemetery satellite view showing roads, buildings with red roof, and surrounding vegetation",
              "Satellite view ng Anahao Public Cemetery na nagpapakita ng mga kalsada, gusali na may pulang bubong, at mga halaman sa paligid"
            )}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
          
          {/* Navigation Route Overlay with markers inside SVG */}
          {navigationTarget && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Navigation Route Line - follows the white road path */}
              <path
                d="M 5 310 Q 40 290 80 265 L 130 230 Q 160 210 190 190 L 220 170 Q 260 145 300 120 L 340 95 Q 360 85 385 70"
                fill="none"
                stroke="#22c55e"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {/* User Location Marker - at line start (bottom-left on road) */}
              <g transform="translate(5, 310)">
                <circle cx="0" cy="0" r="14" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="3" />
                <polygon points="0,-8 5,6 -5,6" fill="#22c55e" transform="rotate(45) translate(0, -6)" />
              </g>

              {/* Destination Marker - on a blue mausoleum */}
              <g transform="translate(270, 175)">
                {/* Pin shadow */}
                <ellipse cx="0" cy="18" rx="8" ry="4" fill="rgba(0,0,0,0.2)" />
                {/* Pin point */}
                <polygon points="0,16 -8,0 8,0" fill="#a3e635" />
                {/* Pin circle */}
                <circle cx="0" cy="-8" r="14" fill="#a3e635" stroke="white" strokeWidth="2" />
                {/* Pin center dot */}
                <circle cx="0" cy="-8" r="5" fill="white" />
              </g>
            </svg>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center bg-card rounded-full shadow-lg border border-border hover:bg-muted transition-colors"
            aria-label={t("Zoom in", "Palakihin")}
          >
            <ZoomIn className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center bg-card rounded-full shadow-lg border border-border hover:bg-muted transition-colors"
            aria-label={t("Zoom out", "Paliitin")}
          >
            <ZoomOut className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={handleReset}
            className="px-3 py-2 flex items-center justify-center bg-card rounded-full shadow-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            {t("Reset", "Reset")}
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-3">
          <p className="text-xs font-semibold text-foreground mb-2">{t("Legend", "Alamat")}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#3b82f6]" />
              <span className="text-xs text-foreground">{t("Mausoleum", "Mausoleo")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#facc15]" />
              <span className="text-xs text-foreground">{t("Garden", "Hardin")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#dc2626]" />
              <span className="text-xs text-foreground">{t("Apartment", "Apartment")}</span>
            </div>
          </div>
        </div>

        {/* Navigation Indicator */}
        {navigationTarget && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 mr-16">
            <div className="flex items-center gap-3 bg-[#1a472a] text-white px-5 py-3 rounded-full shadow-xl">
              <div className="w-7 h-7 flex items-center justify-center bg-[#4ade80] rounded-full flex-shrink-0">
                <Navigation className="w-4 h-4 text-[#1a472a] fill-[#1a472a]" />
              </div>
              <div>
                <p className="text-xs text-white/70">{t("Navigating to", "Papunta sa")}</p>
                <p className="font-semibold text-white whitespace-nowrap">{navigationTarget.name}</p>
              </div>
              <button
                onClick={onCancelNavigation}
                className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-full flex-shrink-0 hover:bg-red-600 transition-colors"
                aria-label={t("Cancel navigation", "Kanselahin ang navigasyon")}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
