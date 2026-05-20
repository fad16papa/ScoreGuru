import { Badge } from '../shared/Badge'
import { isLiveStatus } from '../../features/scores/sportsUtils'
import { LiveBadge } from './LiveBadge'

type StatusBadgeProps = {
  status: string
  statusShort: string
  elapsed?: number | null
}

export function StatusBadge({ status, statusShort, elapsed }: StatusBadgeProps) {
  if (isLiveStatus(statusShort)) {
    return <LiveBadge elapsed={elapsed} />
  }

  return (
    <Badge variant="muted" className="normal-case tracking-normal">
      {statusShort || status}
    </Badge>
  )
}
