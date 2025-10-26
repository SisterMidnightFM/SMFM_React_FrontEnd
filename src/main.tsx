import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext'
import { EpisodePlayerProvider } from './contexts/EpisodePlayerContext'
import { GlobalEpisodePlayer } from './components/episodes/GlobalEpisodePlayer'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <EpisodePlayerProvider>
        <RouterProvider router={router} />
        <GlobalEpisodePlayer />
      </EpisodePlayerProvider>
    </AudioPlayerProvider>
  </React.StrictMode>,
)