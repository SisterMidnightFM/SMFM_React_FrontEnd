import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { SidePanel } from '../components/layout/SidePanel'
import { ExplorePanel } from '../components/layout/ExplorePanel'
import { UpNextPanel } from '../components/layout/UpNextPanel'
import { CardClipPaths } from '../components/shared/Card'
import { useIsDesktop } from '../hooks/useMediaQuery'
import './root.css'

// Star images for decorative elements
const STAR_IMAGES = [
  '/Images/Star1_Dark.webp',
  '/Images/Star2_Dark.webp',
  '/Images/Star3_Dark.webp',
  '/Images/Star4_Dark.webp',
]

// Get random stars for each button
const getRandomStars = () => {
  const shuffled = [...STAR_IMAGES].sort(() => Math.random() - 0.5)
  return {
    exploreStar1: shuffled[0],
    exploreStar2: shuffled[1],
    upNextStar1: shuffled[2],
    upNextStar2: shuffled[3],
  }
}

function RootComponent() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const [isUpNextOpen, setIsUpNextOpen] = useState(false)
  const isDesktop = useIsDesktop()
  const [stars] = useState(getRandomStars)
  const rafRef = useRef<number>(0)

  // Auto-open/close Up Next based on desktop/mobile and page
  useEffect(() => {
    if (!isHomePage) {
      setIsUpNextOpen(isDesktop)
    } else {
      setIsUpNextOpen(false)
    }
  }, [isDesktop, isHomePage])

  // Throttled scroll handler for homepage Up Next panel
  const handleScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      const scrollThreshold = window.innerHeight * 0.7
      setIsUpNextOpen(window.scrollY > scrollThreshold)
      rafRef.current = 0
    })
  }, [])

  useEffect(() => {
    if (!isHomePage || !isDesktop) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }
  }, [isHomePage, isDesktop, handleScroll])

  const isMobile = !isDesktop

  return (
    <div className={`app-container ${isUpNextOpen && isDesktop ? 'app-container--up-next-open' : ''} ${isExploreOpen ? 'app-container--explore-open' : ''} ${isHomePage && !isUpNextOpen && isDesktop ? 'app-container--homepage-up-next-closed' : ''}`}>
      {/* SVG clip-path definitions for hand-drawn card borders */}
      <CardClipPaths />

      <Header />

      {/* Empty header space for Up Next panel on desktop */}
      {isUpNextOpen && isDesktop && (
        <div className="up-next-header-space" />
      )}

      <div className="main-layout">
        {/* Explore button - left side */}
        <button
          className="side-button side-button--left"
          onClick={() => setIsExploreOpen(!isExploreOpen)}
          aria-label={isExploreOpen ? 'Close explore menu' : 'Open explore menu'}
        >
          <span className="side-button__text">
            <img src={stars.exploreStar1} alt="" className="side-button__star" />
            <span className="side-button__label">EXPLORE</span>
            <img src={stars.exploreStar2} alt="" className="side-button__star" />
          </span>
        </button>

        {/* Main content area */}
        <main className="main-content">
          <Outlet />
          <Footer />
        </main>

        {/* Up Next button - right side (only visible on mobile) */}
        <button
          className="side-button side-button--right"
          onClick={() => setIsUpNextOpen(!isUpNextOpen)}
          aria-label={isUpNextOpen ? 'Close up next panel' : 'Open up next panel'}
        >
          <span className="side-button__text">
            <img src={stars.upNextStar1} alt="" className="side-button__star" />
            <span className="side-button__label">UP NEXT</span>
            <img src={stars.upNextStar2} alt="" className="side-button__star" />
          </span>
        </button>

        {/* Explore Panel - slides from left */}
        <SidePanel
          isOpen={isExploreOpen}
          onClose={() => setIsExploreOpen(false)}
          side="left"
          isMobile={isMobile}
        >
          <ExplorePanel onClose={() => setIsExploreOpen(false)} />
        </SidePanel>

        {/* Up Next Panel - right side */}
        <SidePanel
          isOpen={isUpNextOpen}
          onClose={() => setIsUpNextOpen(false)}
          side="right"
          isMobile={isMobile}
        >
          <UpNextPanel />
        </SidePanel>

        {/* Dark overlay when panels are open on mobile */}
        {isExploreOpen && (
          <div
            className="overlay"
            onClick={() => setIsExploreOpen(false)}
            aria-hidden="true"
          />
        )}
        {isUpNextOpen && isMobile && (
          <div
            className="overlay"
            onClick={() => setIsUpNextOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: () => (
    <div>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  ),
})
