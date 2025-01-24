import { PermissionAction } from '@supabase/shared-types/out/constants'
import type { NextPageWithLayout } from 'types'

import { RealtimeInspector } from 'components/interfaces/Realtime/Inspector'
import RealtimeLayout from 'components/layouts/RealtimeLayout/RealtimeLayout'
import NoPermission from 'components/ui/NoPermission'
import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import AppLayout from 'components/layouts/AppLayout/AppLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'

export const InspectorPage: NextPageWithLayout = () => {
  const canReadAPIKeys = useCheckPermissions(PermissionAction.READ, 'service_api_keys')

  if (!canReadAPIKeys) {
    return <NoPermission isFullPage resourceText="access your project's realtime functionalities" />
  }

  return <RealtimeInspector />
}

InspectorPage.getLayout = (page) => (
  <AppLayout>
    <DefaultLayout product="Realtime Inspector">
      <RealtimeLayout title="Realtime Inspector">{page}</RealtimeLayout>
    </DefaultLayout>
  </AppLayout>
)

export default InspectorPage
