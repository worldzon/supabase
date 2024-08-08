import { supabaseOnlyServerRoute } from '~/app/(tooling)/tooling.auth.server'
import { relatedContentRequestSchema } from './relatedContent.schema'

export const GET = supabaseOnlyServerRoute(handleGetRelatedContent)

async function handleGetRelatedContent(request: Request) {
  const { body } = request
  const { data, error } = relatedContentRequestSchema.safeParse(body)

  if (error) {
    return new Response('Content is a required field, and must be a non-empty string', {
      status: 400,
    })
  }

  const { content } = data

  return Response.json({})
}
