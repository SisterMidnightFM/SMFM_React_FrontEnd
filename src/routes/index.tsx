import { createFileRoute } from '@tanstack/react-router'
import { StaffPicks } from '../components/home/StaffPicks'
import { LatestEpisodes } from '../components/home/LatestEpisodes'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <StaffPicks />
      <LatestEpisodes />
    </div>
  )
}