import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query'

import { get, handleError } from 'data/fetchers'
import { ResponseError } from 'types'
import { replicationKeys } from './keys'

type PipelineStatusParams = { pipelineId: number; refetchInterval: number | false }
type ReplicationPipelinesStatusParams = { projectRef?: string; pipelineId: number }
type ReplicationPipelinesStatusesParams = {
  projectRef?: string
  statusParams: PipelineStatusParams[]
}

async function fetchReplicationPipelineStatus(
  { projectRef, pipelineId }: ReplicationPipelinesStatusParams,
  signal?: AbortSignal
) {
  if (!projectRef) throw new Error('projectRef is required')

  const { data, error } = await get('/platform/replication/{ref}/pipelines/{pipeline_id}/status', {
    params: { path: { ref: projectRef, pipeline_id: pipelineId } },
    signal,
  })
  if (error) {
    handleError(error)
  }

  return data
}

export type ReplicationPipelineStatusData = Awaited<
  ReturnType<typeof fetchReplicationPipelineStatus>
>

export const useReplicationPipelineStatusQuery = <TData = ReplicationPipelineStatusData>(
  { projectRef, pipelineId }: ReplicationPipelinesStatusParams,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<ReplicationPipelineStatusData, ResponseError, TData> = {}
) =>
  useQuery<ReplicationPipelineStatusData, ResponseError, TData>(
    replicationKeys.pipelinesStatus(projectRef, pipelineId),
    ({ signal }) => fetchReplicationPipelineStatus({ projectRef, pipelineId }, signal),
    { enabled: enabled && typeof projectRef !== 'undefined', ...options }
  )

type TQueries = UseQueryOptions<ReplicationPipelineStatusData>[]

export const useReplicationPipelinesStatuesQuery = ({
  projectRef,
  statusParams,
}: ReplicationPipelinesStatusesParams) => {
  return useQueries<TQueries>({
    queries: statusParams.map(({ pipelineId, refetchInterval }) => {
      return {
        queryKey: replicationKeys.pipelinesStatus(projectRef, pipelineId),
        queryFn: ({ signal }) => fetchReplicationPipelineStatus({ projectRef, pipelineId }, signal),
        refetchInterval,
      }
    }),
  })
}
