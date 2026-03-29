'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Preços', href: '/precos' },
    { label: 'Boosters', href: '/boosters' },
    { label: 'Histórico', href: '/historico' },
    { label: 'Discord', href: 'https://discord.gg/akbFh3wJ', external: true },
    { label: 'Suporte', href: '/suporte' },
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 glass-card electric-navbar">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="https://customer-assets.emergentagent.com/job_53d02550-cf1c-446a-a254-b64d519a09e0/artifacts/9wwyxxmg_image.png"
            alt="Elo Fast Skins"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="font-bold text-xl hidden sm:inline gamer-gradient bg-clip-text text-transparent">
            ELO FAST SKINS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-primary-500"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary-500"
              >
                {item.label}
              </Link>
            )
          ))}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            asChild
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
          >
            <Link href="/precos">Contratar Agora</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 glass-card">
          <div className="container py-4 space-y-3">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary-500 hover:bg-primary-500/10 rounded-lg"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary-500 hover:bg-primary-500/10 rounded-lg"
                >
                  {item.label}
                </Link>
              )
            ))}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
            >
              <Link href="/precos">Contratar Agora</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}