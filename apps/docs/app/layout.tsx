import type { ReactNode } from 'react'

import { AuthContainer } from '~/features/auth/auth.client'
import { QueryClientProvider } from '~/features/data/queryClient.client'

export default function GlobalProvidersLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider>
      <AuthContainer>{children}</AuthContainer>
    </QueryClientProvider>
  )
}
