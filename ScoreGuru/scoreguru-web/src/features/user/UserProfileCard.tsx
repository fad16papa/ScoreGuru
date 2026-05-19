import { Card } from '../../components/shared/Card'
import type { MeResponse } from '../../services/types/authTypes'

type UserProfileCardProps = {
  user: MeResponse
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="space-y-3">
      <h2 className="font-jakarta text-base font-semibold text-cr-text-dark dark:text-cr-text-light">
        ScoreGuru account
      </h2>
      <dl className="grid gap-2 font-inter text-sm">
        <ProfileRow label="Email" value={user.email ?? '—'} />
        <ProfileRow label="Display name" value={user.displayName ?? '—'} />
        <ProfileRow label="User ID" value={user.id} mono />
        <ProfileRow label="Clerk ID" value={user.clerkUserId} mono />
        <ProfileRow label="Status" value={user.isActive ? 'Active' : 'Inactive'} />
      </dl>
    </Card>
  )
}

function ProfileRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[120px_1fr]">
      <dt className="text-cr-muted dark:text-cr-muted-dark">{label}</dt>
      <dd
        className={[
          'text-cr-text-dark dark:text-cr-text-light',
          mono ? 'break-all font-mono text-xs' : '',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  )
}
