import type { ReactNode } from 'react'

import { IS_PLATFORM } from 'common'

import { useOrganizationsQuery } from '~/lib/fetch/organizations'
import { ResponseError } from '~/types/fetch'
import { isPartOfSupabase } from './tooling.auth.shared'

function isUnauthenticatedError(error: ResponseError) {
  return /without signing in/.test(error.message)
}

/**
 * Wrap a page component so it displays to Supabase internal users only.
 *
 * This is a frontend check, _not_ a backend check, so it only serves the
 * purpose of not displaying broken UI to the public. It is _not_ a security
 * measure.
 */
export function withDisplayForSupabaseOnly(PageComponent: () => ReactNode) {
  return function ShowOnlyForSupabasePage() {
    const {
      data: organizations,
      isError: isOrganizationsError,
      error: organizationsError,
      isLoading: isOrganizationsLoading,
    } = useOrganizationsQuery({
      enabled: IS_PLATFORM,
      retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 3,
    })

    const notSignedIn = isOrganizationsError && isUnauthenticatedError(organizationsError)
    const isSupabaseMember = isPartOfSupabase(organizations)

    if (isOrganizationsLoading) {
      return <Loading />
    } else if (notSignedIn) {
      return <Login />
    } else if (isOrganizationsError) {
      return <Error />
    } else if (!isSupabaseMember) {
      return <NotAllowed />
    } else {
      return <PageComponent />
    }
  }
}

function Loading() {
  return <Center>User loading...</Center>
}

function Login() {
  return <Center>Log in...</Center>
}

function Error() {
  return <Center>Error</Center>
}

function NotAllowed() {
  return <Center>Not allowed</Center>
}

function Center({ children }: { children: ReactNode }) {
  return <main className="w-screen h-screen flex items-center justify-center">{children}</main>
}
