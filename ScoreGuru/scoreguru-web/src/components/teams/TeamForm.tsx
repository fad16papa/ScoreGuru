import { Card } from '../shared/Card'
import { FormIndicatorChips } from '../standings/FormIndicatorChips'

type TeamFormProps = {
  form: string
}

export function TeamForm({ form }: TeamFormProps) {
  return (
    <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
          Form
        </h3>
        <p className="mt-0.5 font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          From loaded finished fixtures (most recent on the right).
        </p>
      </div>
      <FormIndicatorChips form={form || null} />
    </Card>
  )
}
