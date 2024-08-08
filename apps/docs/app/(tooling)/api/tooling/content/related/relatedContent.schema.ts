import { z } from 'zod'

export const relatedContentRequestSchema = z.object({
  content: z.string().min(1),
})
export type IRelatedContentRequestSchema = z.infer<typeof relatedContentRequestSchema>
