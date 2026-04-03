"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface BookmarkedDeceased {
  id: string
  name: string
  section: string
  block: string
  row: string
  graveNumber: string
  bookmarkedAt: string
  deathDate?: string
}

export interface GraveMovedNotification {
  id: string
  type: "grave_moved"
  deceasedName: string
  oldLocation: {
    section: string
    block: string
    row: string
    graveNumber: string
  }
  newLocation: {
    section: string
    block: string
    row: string
    graveNumber: string
  }
  movedAt: string
  read: boolean
}

export interface ReservationApprovedNotification {
  id: string
  type: "reservation_approved"
  section: string
  block: string
  row: string
  lotNumber: string
  approvedAt: string
  read: boolean
}

export interface AnniversaryNotification {
  id: string
  type: "anniversary_upcoming"
  deceasedName: string
  deathDate: string
  daysUntilAnniversary: number
  bookmarkId: string
  createdAt: string
  read: boolean
}

export type AppNotification = GraveMovedNotification | ReservationApprovedNotification | AnniversaryNotification

interface BookmarkContextType {
  bookmarks: BookmarkedDeceased[]
  notifications: AppNotification[]
  addBookmark: (deceased: Omit<BookmarkedDeceased, "id" | "bookmarkedAt">) => void
  removeBookmark: (name: string) => void
  isBookmarked: (name: string) => boolean
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void
  unreadCount: number
}

const defaultContextValue: BookmarkContextType = {
  bookmarks: [],
  notifications: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
  markNotificationAsRead: () => {},
  clearAllNotifications: () => {},
  unreadCount: 0,
}

const BookmarkContext = createContext<BookmarkContextType>(defaultContextValue)

// Example notifications to show on first load
const exampleNotifications: AppNotification[] = [
  {
    id: "example-grave-moved-1",
    type: "grave_moved",
    deceasedName: "Maria Santos",
    oldLocation: {
      section: "Section A",
      block: "Block 2",
      row: "Row 3",
      graveNumber: "15",
    },
    newLocation: {
      section: "Section C",
      block: "Block 1",
      row: "Row 5",
      graveNumber: "8",
    },
    movedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: false,
  },
  {
    id: "example-reservation-1",
    type: "reservation_approved",
    section: "Section B",
    block: "Block 4",
    row: "Row 2",
    lotNumber: "12",
    approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
  },
]

// Utility function to calculate days until next death anniversary
function calculateDaysUntilAnniversary(deathDateString: string): number {
  const deathDate = new Date(deathDateString)
  const today = new Date()
  
  // Get the month and day from death date
  const monthDay = `${String(deathDate.getMonth() + 1).padStart(2, '0')}-${String(deathDate.getDate()).padStart(2, '0')}`
  
  // Create anniversary date for this year
  let anniversaryDate = new Date(today.getFullYear(), deathDate.getMonth(), deathDate.getDate())
  
  // If anniversary already passed this year, check next year
  if (anniversaryDate < today) {
    anniversaryDate = new Date(today.getFullYear() + 1, deathDate.getMonth(), deathDate.getDate())
  }
  
  // Calculate days until anniversary
  const diffTime = anniversaryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Check if anniversary notification should be created (within 30 days)
function shouldCreateAnniversaryNotification(deathDate: string): boolean {
  const daysUntil = calculateDaysUntilAnniversary(deathDate)
  return daysUntil >= 0 && daysUntil <= 30
}

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedDeceased[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [mounted, setMounted] = useState(false)

  // Load bookmarks and notifications from localStorage
  useEffect(() => {
    setMounted(true)
    const storedBookmarks = localStorage.getItem("memorial-nav-bookmarks")
    if (storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks))
      } catch {
        // Use default if parse fails
      }
    }
    const storedNotifications = localStorage.getItem("memorial-nav-grave-notifications")
    const hasSeenExamples = localStorage.getItem("memorial-nav-examples-shown")
    
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications)
        setNotifications(parsed)
      } catch {
        // Use default if parse fails
      }
    } else if (!hasSeenExamples) {
      // Show example notifications on first load
      setNotifications(exampleNotifications)
      localStorage.setItem("memorial-nav-grave-notifications", JSON.stringify(exampleNotifications))
      localStorage.setItem("memorial-nav-examples-shown", "true")
    }
  }, [])

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: BookmarkedDeceased[]) => {
    setBookmarks(newBookmarks)
    localStorage.setItem("memorial-nav-bookmarks", JSON.stringify(newBookmarks))
  }

  // Save notifications to localStorage
  const saveNotifications = (newNotifications: AppNotification[]) => {
    setNotifications(newNotifications)
    localStorage.setItem("memorial-nav-grave-notifications", JSON.stringify(newNotifications))
  }

  const addBookmark = (deceased: Omit<BookmarkedDeceased, "id" | "bookmarkedAt">) => {
    if (isBookmarked(deceased.name)) return
    
    const newBookmark: BookmarkedDeceased = {
      ...deceased,
      id: `bookmark-${Date.now()}`,
      bookmarkedAt: new Date().toISOString(),
    }
    saveBookmarks([...bookmarks, newBookmark])
    
    // Check if anniversary notification should be created
    if (deceased.deathDate && shouldCreateAnniversaryNotification(deceased.deathDate)) {
      const daysUntil = calculateDaysUntilAnniversary(deceased.deathDate)
      const anniversaryNotification: AnniversaryNotification = {
        id: `anniversary-${Date.now()}`,
        type: "anniversary_upcoming",
        deceasedName: deceased.name,
        deathDate: deceased.deathDate,
        daysUntilAnniversary: daysUntil,
        bookmarkId: newBookmark.id,
        createdAt: new Date().toISOString(),
        read: false,
      }
      saveNotifications([...notifications, anniversaryNotification])
    }
  }

  const removeBookmark = (name: string) => {
    saveBookmarks(bookmarks.filter(b => b.name !== name))
  }

  const isBookmarked = (name: string) => {
    return bookmarks.some(b => b.name === name)
  }

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    saveNotifications(updated)
  }

  const clearAllNotifications = () => {
    saveNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      notifications,
      addBookmark,
      removeBookmark,
      isBookmarked,
      markNotificationAsRead,
      clearAllNotifications,
      unreadCount,
    }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider")
  }
  return context
}
