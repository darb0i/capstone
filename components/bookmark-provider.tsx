"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

export interface BookmarkedDeceased {
  id: string
  name: string
  section: string
  block: string
  row: string
  graveNumber: string
  deathDate: string
  bookmarkedAt: string
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

export interface DeathAnniversaryNotification {
  id: string
  type: "death_anniversary"
  deceasedName: string
  deathDate: string
  yearsAgo: number
  daysUntil: number
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

export type AppNotification = GraveMovedNotification | DeathAnniversaryNotification | ReservationApprovedNotification

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

// Helper function to calculate days until next anniversary
function getDaysUntilAnniversary(deathDateStr: string): { daysUntil: number; yearsAgo: number } {
  const deathDate = new Date(deathDateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const deathMonth = deathDate.getMonth()
  const deathDay = deathDate.getDate()
  const deathYear = deathDate.getFullYear()
  
  // Create this year's anniversary date
  let nextAnniversary = new Date(today.getFullYear(), deathMonth, deathDay)
  nextAnniversary.setHours(0, 0, 0, 0)
  
  // If anniversary has passed this year, use next year
  if (nextAnniversary < today) {
    nextAnniversary = new Date(today.getFullYear() + 1, deathMonth, deathDay)
  }
  
  const diffTime = nextAnniversary.getTime() - today.getTime()
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Calculate years since death (for the upcoming anniversary)
  const yearsAgo = nextAnniversary.getFullYear() - deathYear
  
  return { daysUntil, yearsAgo }
}

// Generate death anniversary notification if within 7 days
function generateAnniversaryNotification(bookmark: BookmarkedDeceased): DeathAnniversaryNotification | null {
  if (!bookmark.deathDate) return null
  
  const { daysUntil, yearsAgo } = getDaysUntilAnniversary(bookmark.deathDate)
  
  // Notify if anniversary is within 7 days
  if (daysUntil <= 7 && daysUntil >= 0) {
    return {
      id: `anniversary-${bookmark.id}-${new Date().getFullYear()}`,
      type: "death_anniversary",
      deceasedName: bookmark.name,
      deathDate: bookmark.deathDate,
      yearsAgo,
      daysUntil,
      read: false,
    }
  }
  
  return null
}

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedDeceased[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [mounted, setMounted] = useState(false)

  // Check for upcoming anniversaries and generate notifications
  const checkAnniversaries = useCallback((currentBookmarks: BookmarkedDeceased[], currentNotifications: AppNotification[]) => {
    const newNotifications: AppNotification[] = []
    
    for (const bookmark of currentBookmarks) {
      const notification = generateAnniversaryNotification(bookmark)
      if (notification) {
        // Check if we already have this notification (avoid duplicates)
        const exists = currentNotifications.some(n => n.id === notification.id)
        if (!exists) {
          newNotifications.push(notification)
        }
      }
    }
    
    return newNotifications
  }, [])

  // Load bookmarks and notifications from localStorage
  useEffect(() => {
    setMounted(true)
    let loadedBookmarks: BookmarkedDeceased[] = []
    let loadedNotifications: AppNotification[] = []
    
    const storedBookmarks = localStorage.getItem("memorial-nav-bookmarks")
    if (storedBookmarks) {
      try {
        loadedBookmarks = JSON.parse(storedBookmarks)
        setBookmarks(loadedBookmarks)
      } catch {
        // Use default if parse fails
      }
    }
    
    const storedNotifications = localStorage.getItem("memorial-nav-grave-notifications")
    if (storedNotifications) {
      try {
        loadedNotifications = JSON.parse(storedNotifications)
      } catch {
        // Use default if parse fails
      }
    }
    
    // Only show notifications if user has bookmarked graves
    // And check for upcoming anniversaries
    if (loadedBookmarks.length > 0) {
      const anniversaryNotifications = checkAnniversaries(loadedBookmarks, loadedNotifications)
      const allNotifications = [...loadedNotifications, ...anniversaryNotifications]
      setNotifications(allNotifications)
      if (anniversaryNotifications.length > 0) {
        localStorage.setItem("memorial-nav-grave-notifications", JSON.stringify(allNotifications))
      }
    } else {
      // No bookmarks, clear any notifications
      setNotifications([])
      localStorage.removeItem("memorial-nav-grave-notifications")
    }
  }, [checkAnniversaries])

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
    
    const updatedBookmarks = [...bookmarks, newBookmark]
    saveBookmarks(updatedBookmarks)
    
    // Check if this bookmarked grave has an upcoming anniversary
    const anniversaryNotification = generateAnniversaryNotification(newBookmark)
    if (anniversaryNotification) {
      const updatedNotifications = [...notifications, anniversaryNotification]
      saveNotifications(updatedNotifications)
    }
  }

  const removeBookmark = (name: string) => {
    const bookmarkToRemove = bookmarks.find(b => b.name === name)
    saveBookmarks(bookmarks.filter(b => b.name !== name))
    
    // Remove any anniversary notifications for this bookmark
    if (bookmarkToRemove) {
      const updatedNotifications = notifications.filter(n => {
        if (n.type === "death_anniversary") {
          return n.deceasedName !== name
        }
        return true
      })
      if (updatedNotifications.length !== notifications.length) {
        saveNotifications(updatedNotifications)
      }
    }
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
