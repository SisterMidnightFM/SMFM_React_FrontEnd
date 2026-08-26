import { createFileRoute } from '@tanstack/react-router'
import { HeroLogo } from '../components/home/HeroLogo'
import { SMFMPicks } from '../components/home/SMFMPicks'
import { GuestShows } from '../components/home/GuestShows'
import { LatestEpisodes } from '../components/home/LatestEpisodes'
import { Residents } from '../components/home/Residents'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <HeroLogo />
      <SMFMPicks />
      <LatestEpisodes />
      <GuestShows />
      <Residents />
    </div>
  )
}
