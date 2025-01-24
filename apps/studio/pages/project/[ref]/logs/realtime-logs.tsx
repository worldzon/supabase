import { useRouter } from 'next/router'

import LogsPreviewer from 'components/interfaces/Settings/Logs/LogsPreviewer'
import LogsLayout from 'components/layouts/LogsLayout/LogsLayout'
import type { NextPageWithLayout } from 'types'
import AppLayout from 'components/layouts/AppLayout/AppLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'

export const LogPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { ref } = router.query

  return (
    <LogsPreviewer
      projectRef={ref as string}
      condensedLayout={true}
      // @ts-ignore
      tableName={'realtime_logs'}
      queryType={'realtime'}
    />
  )
}

LogPage.getLayout = (page) => (
  <AppLayout>
    <DefaultLayout product="Realtime logs">
      <LogsLayout title="Realtime Logs">{page}</LogsLayout>
    </DefaultLayout>
  </AppLayout>
)

export default LogPage
