import { ChevronRight } from 'lucide-react'

import { useParams } from 'common'
import { ColumnList } from 'components/interfaces/Database'
import { SidePanelEditor } from 'components/interfaces/TableGridEditor'
import DeleteConfirmationDialogs from 'components/interfaces/TableGridEditor/DeleteConfirmationDialogs'
import DatabaseLayout from 'components/layouts/DatabaseLayout/DatabaseLayout'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import { FormHeader } from 'components/ui/Forms/FormHeader'
import { useTableEditorQuery } from 'data/table-editor/table-editor-query'
import { isTableLike } from 'data/table-editor/table-editor-types'
import { useTableEditorStateSnapshot } from 'state/table-editor'
import type { NextPageWithLayout } from 'types'
import ShimmeringLoader from 'ui-patterns/ShimmeringLoader'
import AppLayout from 'components/layouts/AppLayout/AppLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'

const DatabaseTables: NextPageWithLayout = () => {
  const snap = useTableEditorStateSnapshot()

  const { id: _id } = useParams()
  const id = _id ? Number(_id) : undefined

  const { project } = useProjectContext()
  const { data: selectedTable, isLoading } = useTableEditorQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    id,
  })

  return (
    <>
      <ScaffoldContainer>
        <ScaffoldSection>
          <div className="col-span-12 space-y-6">
            <div className="flex items-center space-x-2">
              <FormHeader className="!mb-0" title="Database Tables" />
              <ChevronRight size={18} strokeWidth={1.5} className="text-foreground-light" />
              {isLoading ? (
                <ShimmeringLoader className="w-40" />
              ) : (
                <FormHeader className="!mb-0" title={selectedTable?.name ?? ''} />
              )}
            </div>
            <ColumnList
              onAddColumn={snap.onAddColumn}
              onEditColumn={snap.onEditColumn}
              onDeleteColumn={snap.onDeleteColumn}
            />
          </div>
        </ScaffoldSection>
      </ScaffoldContainer>

      <DeleteConfirmationDialogs selectedTable={selectedTable} />
      <SidePanelEditor
        includeColumns
        selectedTable={isTableLike(selectedTable) ? selectedTable : undefined}
      />
    </>
  )
}

DatabaseTables.getLayout = (page) => (
  <AppLayout>
    <DefaultLayout product="Tables">
      <DatabaseLayout title="Database">{page}</DatabaseLayout>
    </DefaultLayout>
  </AppLayout>
)

export default DatabaseTables
