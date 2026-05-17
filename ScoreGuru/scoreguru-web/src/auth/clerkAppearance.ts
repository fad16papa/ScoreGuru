/**
 * Clerk `appearance` using ScoreGuru brand tokens (aligned with docs/design/mvp-design-system.md).
 * Hex values match official --cr-purple; Clerk's theme API expects explicit colors.
 */
export function getClerkAppearance() {
  return {
    variables: {
      colorPrimary: '#9333ea',
      colorDanger: '#dc2626',
      colorSuccess: '#16a34a',
      colorWarning: '#eab308',
      borderRadius: '0.75rem',
    },
  }
}
