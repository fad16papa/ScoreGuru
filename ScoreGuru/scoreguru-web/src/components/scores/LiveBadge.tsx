import { Badge } from '../shared/Badge'

type LiveBadgeProps = {
  elapsed?: number | null
  className?: string
}

export function LiveBadge({ elapsed, className = '' }: LiveBadgeProps) {
  return (
    <Badge variant="live" className={className}>
      {elapsed != null ? `Live ${elapsed}'` : 'Live'}
    </Badge>
  )
}
