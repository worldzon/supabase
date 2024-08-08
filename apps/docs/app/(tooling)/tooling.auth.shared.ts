import { IS_PLATFORM } from 'common'

import { IS_DEV, IS_PREVIEW } from '~/lib/constants'
import type { OrganizationsData } from '~/lib/fetch/organizations'

export function isPartOfSupabase(organizations: OrganizationsData | undefined) {
  if (!IS_PLATFORM) return false
  if (!organizations) return false

  /*
   * Only Supabase team members can have a staging account, but they don't need
   * to be part of a Supabase org, so allow anyone who has a staging account
   * through on preview without checking their orgs.
   */
  if (IS_DEV || IS_PREVIEW) return true

  return organizations.some(
    (organization) =>
      organization.id === 1 && organization.slug === 'supabase' && organization.name === 'Supabase'
  )
}
