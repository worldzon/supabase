import createClient from 'openapi-fetch'
import { headers } from 'next/headers'

import type { paths } from 'api-types'

import { isPartOfSupabase } from './tooling.auth.shared'

type RouteHandler = (request: Request) => Promise<Response>

/**
 * Wrap a Route Handler to only allow requests coming from members of the
 * Supabase organization.
 */
export function supabaseOnlyServerRoute(handler: RouteHandler): RouteHandler {
  return async function handleRouteForSupabaseMembers(request: Request) {
    const requestHeaders = headers()
    const authorizationHeader = requestHeaders.get('Authorization') ?? ''
    const authenticationToken = authorizationHeader.replace(/^Bearer /, '')
    if (!authenticationToken) {
      return new Response('You must authenticate to use this endpoint', { status: 401 })
    }

    const { GET } = createClient<paths>()
    const outgoingHeaders = new Headers()
    outgoingHeaders.set('Authorization', `Bearer ${authenticationToken}`)
    const {
      data: organizations,
      error,
      response,
    } = await GET('/platform/organizations', {
      headers: outgoingHeaders,
    })

    if (error) {
      return new Response(response.statusText, { status: response.status })
    }

    if (!isPartOfSupabase(organizations)) {
      return new Response("You don't have sufficient permissions to use this endpoint", {
        status: 403,
      })
    }

    return handler(request)
  }
}
