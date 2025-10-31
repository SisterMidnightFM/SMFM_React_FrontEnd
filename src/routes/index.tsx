import { createFileRoute } from '@tanstack/react-router'
import { HeroLogo } from '../components/home/HeroLogo'
import { SMFMPicks } from '../components/home/SMFMPicks'
import { LatestEpisodes } from '../components/home/LatestEpisodes'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <HeroLogo />
      <SMFMPicks />
      <LatestEpisodes />
    </div>
  )
}