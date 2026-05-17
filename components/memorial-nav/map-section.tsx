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
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
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
    setZoom(1)
    setPosition({ x: 0, y: 0 })
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
        <div className="w-10 h-10 flex items-center justify-center border-2 border-[#1a472a] dark:border-[#4ade80] rounded-lg text-[#1a472a] dark:text-[#4ade80]">
          <Compass className="w-5 h-5" />
          <span className="sr-only">{t("Compass", "Compass")}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-lg">
            <MapPin className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
            <input
              type="text"
              placeholder={t("Search lots or deaceased...", "Hanapin ang lupa o labi...")}
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
        className="flex-1 relative mx-4 mb-4 rounded-xl overflow-hidden bg-[#e8dcc8] min-h-0 touch-none"
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
          {/* Cemetery Map SVG */}
          <svg
            viewBox="0 0 600 700"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Background - Cemetery Grounds */}
            <rect width="600" height="700" fill="#c8dcc0" />
            
            {/* Garden Type - Yellow Scattered Plots */}
            <circle cx="120" cy="80" r="3" fill="#fbbf24" />
            <circle cx="150" cy="95" r="3" fill="#fbbf24" />
            <circle cx="180" cy="70" r="3" fill="#fbbf24" />
            <circle cx="210" cy="110" r="3" fill="#fbbf24" />
            <circle cx="240" cy="85" r="3" fill="#fbbf24" />
            <circle cx="130" cy="140" r="3" fill="#fbbf24" />
            <circle cx="170" cy="155" r="3" fill="#fbbf24" />
            <circle cx="200" cy="135" r="3" fill="#fbbf24" />
            <circle cx="110" cy="200" r="3" fill="#fbbf24" />
            <circle cx="150" cy="220" r="3" fill="#fbbf24" />
            <circle cx="190" cy="210" r="3" fill="#fbbf24" />
            <circle cx="140" cy="280" r="3" fill="#fbbf24" />
            <circle cx="170" cy="300" r="3" fill="#fbbf24" />
            <circle cx="120" cy="350" r="3" fill="#fbbf24" />
            <circle cx="160" cy="380" r="3" fill="#fbbf24" />
            <circle cx="100" cy="420" r="3" fill="#fbbf24" />
            <circle cx="150" cy="450" r="3" fill="#fbbf24" />
            <circle cx="180" cy="480" r="3" fill="#fbbf24" />
            <circle cx="130" cy="520" r="3" fill="#fbbf24" />
            <circle cx="170" cy="550" r="3" fill="#fbbf24" />
            
            {/* White Curved Paths */}
            <path d="M 300 0 Q 310 100 320 200 Q 325 300 330 400 Q 328 500 320 600 L 320 700" stroke="#ffffff" strokeWidth="25" fill="none" />
            <path d="M 350 0 Q 360 100 370 200 Q 375 300 380 400 Q 378 500 370 600 L 370 700" stroke="#ffffff" strokeWidth="20" fill="none" />
            
            {/* Mausoleum - Blue Squares in Organized Rows */}
            {/* Row 1 */}
            <rect x="380" y="120" width="25" height="25" fill="#2563eb" />
            <rect x="415" y="120" width="25" height="25" fill="#2563eb" />
            <rect x="450" y="120" width="25" height="25" fill="#2563eb" />
            <rect x="485" y="120" width="25" height="25" fill="#2563eb" />
            
            {/* Row 2 */}
            <rect x="380" y="160" width="25" height="25" fill="#2563eb" />
            <rect x="415" y="160" width="25" height="25" fill="#2563eb" />
            <rect x="450" y="160" width="25" height="25" fill="#2563eb" />
            <rect x="485" y="160" width="25" height="25" fill="#2563eb" />
            
            {/* Row 3 */}
            <rect x="380" y="200" width="25" height="25" fill="#2563eb" />
            <rect x="415" y="200" width="25" height="25" fill="#2563eb" />
            <rect x="450" y="200" width="25" height="25" fill="#2563eb" />
            <rect x="485" y="200" width="25" height="25" fill="#2563eb" />
            
            {/* Row 4 */}
            <rect x="380" y="240" width="25" height="25" fill="#2563eb" />
            <rect x="415" y="240" width="25" height="25" fill="#2563eb" />
            <rect x="450" y="240" width="25" height="25" fill="#2563eb" />
            <rect x="485" y="240" width="25" height="25" fill="#2563eb" />
            
            {/* Row 5 */}
            <rect x="380" y="280" width="25" height="25" fill="#2563eb" />
            <rect x="415" y="280" width="25" height="25" fill="#2563eb" />
            <rect x="450" y="280" width="25" height="25" fill="#2563eb" />
            <rect x="485" y="280" width="25" height="25" fill="#2563eb" />
            
            {/* Row 6 */}
            <rect x="380" y="320" width="25" height="25" fill="#2563eb" />
            <rect x="415" y="320" width="25" height="25" fill="#2563eb" />
            <rect x="450" y="320" width="25" height="25" fill="#2563eb" />
            <rect x="485" y="320" width="25" height="25" fill="#2563eb" />
            
            {/* Apartment/Columbarium - Red Vertical Bars */}
            <rect x="50" y="150" width="20" height="250" fill="#ef4444" rx="3" />
            <rect x="540" y="150" width="20" height="250" fill="#ef4444" rx="3" />
          </svg>
          
          {/* Navigation Route Overlay */}
          {navigationTarget && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 600 700"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Navigation Route Line */}
              <path
                d="M 100 350 Q 250 300 400 280 L 450 200"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {/* User Location Marker */}
              <g transform="translate(87, 363)">
                <circle cx="0" cy="0" r="18" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="3" />
                <polygon points="0,-10 6,8 -6,8" fill="#3b82f6" transform="rotate(45) translate(0, -8)" />
              </g>

              {/* Destination Marker */}
              <g transform="translate(450, 200)">
                <ellipse cx="0" cy="18" rx="8" ry="4" fill="rgba(0,0,0,0.2)" />
                <polygon points="0,16 -8,0 8,0" fill="#a3e635" />
                <circle cx="0" cy="-8" r="14" fill="#a3e635" stroke="white" strokeWidth="2" />
                <circle cx="0" cy="-8" r="5" fill="white" />
              </g>
            </svg>
          )}
        </div>

        {/* Legend - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-3">
          <p className="text-xs font-semibold text-foreground mb-2">{t("Legend", "Kalakaran")}</p>
          <div className="space-y-1.5">
            {/* Garden Type - Yellow */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-xs text-muted-foreground">{t("Garden", "Garden")}</span>
            </div>
            {/* Mausoleum - Blue */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600"></div>
              <span className="text-xs text-muted-foreground">{t("Mausoleum", "Mausoleum")}</span>
            </div>
            {/* Apartment - Red */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500"></div>
              <span className="text-xs text-muted-foreground">{t("Apartment", "Apartment")}</span>
            </div>
          </div>
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
