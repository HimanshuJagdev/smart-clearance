"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Menu, Search, Bell, ChevronDown, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { notifications as allNotifications, company } from "@/lib/data"

export function Header({ onMenu }: { onMenu: () => void }) {
  const unread = allNotifications.filter((n) => !n.read).length
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu />
      </Button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search approvals, documents, schemes..."
          className="h-9 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 md:flex-none">
        <a
          href="https://vercel.com/help"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <LifeBuoy className="size-4" />
          Help
        </a>

        <div className="relative" ref={bellRef}>
          <Button variant="ghost" size="icon" onClick={() => setBellOpen((v) => !v)} aria-label="Notifications">
            <span className="relative">
              <Bell />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </span>
          </Button>
          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <Badge variant="danger">{unread} new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {allNotifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex flex-col gap-0.5 border-b border-border/60 px-4 py-3 last:border-0",
                      !n.read && "bg-info-muted/40",
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.detail}</p>
                    <p className="text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/notifications"
                onClick={() => setBellOpen(false)}
                className="block border-t border-border px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted/50"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              RI
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{company.contactPerson}</p>
                <p className="truncate text-xs text-muted-foreground">{company.contactEmail}</p>
              </div>
              <div className="flex flex-col p-1.5">
                <Link href="/profile" onClick={() => setProfileOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                  Industry Profile
                </Link>
                <Link href="/settings" onClick={() => setProfileOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                  Settings
                </Link>
                <Link href="/notifications" onClick={() => setProfileOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                  Notifications
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
