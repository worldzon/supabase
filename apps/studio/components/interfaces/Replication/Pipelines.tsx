import { useParams } from 'common'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import { ButtonTooltip } from 'components/ui/ButtonTooltip'
import { FormHeader } from 'components/ui/Forms/FormHeader'
import { useReplicationPipelinesQuery } from 'data/replication/pipelines-query'
import { Plus } from 'lucide-react'
import Table from 'components/to-be-cleaned/Table'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from 'ui'
import { DeletePipelineModal } from './DeletePipepineModal'
import CreatePipelineModal from './CreatePipelineModal'

export const ReplicationPipelines = () => {
  const { ref } = useParams()
  const { data: pipelines_data } = useReplicationPipelinesQuery({
    projectRef: ref,
  })
  const [showCreatePipelineModal, setShowCreatePipelineModal] = useState(false)
  const [showDeletePipelineModal, setShowDeletePipelineModal] = useState(false)
  const [pipelineIdToDelete, setPipelineIdToDelete] = useState(-1)

  const pipelines = pipelines_data ?? []
  return (
    <>
      <ScaffoldContainer>
        <ScaffoldSection>
          <div className="col-span-12">
            <FormHeader title="Sinks"></FormHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <ButtonTooltip
                  className="ml-auto"
                  icon={<Plus />}
                  tooltip={{
                    content: {
                      side: 'bottom',
                      text: 'Create a pipeline',
                    },
                  }}
                  onClick={() => setShowCreatePipelineModal(true)}
                >
                  New Pipeline
                </ButtonTooltip>
              </div>
              <div className="my-4 w-full">
                <Table
                  head={[
                    <Table.th key="id">Id</Table.th>,
                    <Table.th key="source_id">Source Id</Table.th>,
                    <Table.th key="sink_id">Sink Id</Table.th>,
                    <Table.th key="edit">Edit</Table.th>,
                    <Table.th key="delete">Delete</Table.th>,
                  ]}
                  body={
                    pipelines.length === 0 ? (
                      <Table.tr>
                        <Table.td align="center" colSpan={5}>
                          No pipelines
                        </Table.td>
                      </Table.tr>
                    ) : (
                      pipelines.map((pipeline) => (
                        <Table.tr key={pipeline.id}>
                          <Table.td>{pipeline.id}</Table.td>
                          <Table.td>{pipeline.source_id}</Table.td>
                          <Table.td>{pipeline.sink_id}</Table.td>
                          <Table.td>
                            <Button
                              type="default"
                              onClick={() => {
                                toast.info('Editing a pipeline is not yet implemented')
                              }}
                            >
                              Edit
                            </Button>
                          </Table.td>
                          <Table.td>
                            <Button
                              type="danger"
                              onClick={() => {
                                setPipelineIdToDelete(pipeline.id)
                                setShowDeletePipelineModal(true)
                              }}
                            >
                              Delete
                            </Button>
                          </Table.td>
                        </Table.tr>
                      ))
                    )
                  }
                ></Table>
              </div>
            </div>
          </div>
        </ScaffoldSection>
      </ScaffoldContainer>
      <CreatePipelineModal
        visible={showCreatePipelineModal}
        onClose={() => setShowCreatePipelineModal(false)}
      />
      <DeletePipelineModal
        visible={showDeletePipelineModal}
        title={`Delete pipeline with id ${pipelineIdToDelete}?`}
        pipelineId={pipelineIdToDelete}
        onClose={() => setShowDeletePipelineModal(false)}
      />
    </>
  )
}
