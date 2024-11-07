import { isbot } from 'isbot'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { clientSdkIds } from '~/content/navigation.references'
import {
  FEATURE_FLAGS,
  defaultTelemetryIo,
  isFeatureEnabled,
} from '~/features/telemetry/posthog.client'
import { BASE_PATH } from '~/lib/constants'

const REFERENCE_PATH = `${(BASE_PATH ?? '') + '/'}reference`

export async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const referer = request.headers.get('referer')
  // Ignore the hard-coding mess here for now...
  if (
    url.pathname === '/docs/feature-flagged' &&
    referer === 'http://localhost:3001/docs/feature-flagged'
  ) {
    return NextResponse.error(new Error())
  }

  // [TODO] This should only run on a top-level request
  const telemetryId =
    request.cookies.get('user_id')?.value ?? request.cookies.get('anonymous_id')?.value
  const isFlagEnabled = await isFeatureEnabled(
    FEATURE_FLAGS.CHARIS_TEST,
    telemetryId,
    defaultTelemetryIo
  )
  console.log('TELEMETRY ID:', telemetryId)
  console.log('IS FLAG ENABLED:', isFlagEnabled)
  console.log('PATHNAME:', url.pathname)
  if (isFlagEnabled && url.pathname === BASE_PATH) {
    console.log('IN FEATURE FLAGGED BRANCH')
    const rewriteUrl = new URL(url)
    rewriteUrl.pathname = (BASE_PATH ?? '') + '/feature-flagged'
    return NextResponse.rewrite(rewriteUrl)
  }

  if (!url.pathname.startsWith(REFERENCE_PATH)) {
    return NextResponse.next()
  }

  if (isbot(request.headers.get('user-agent'))) {
    let [, lib, maybeVersion, ...slug] = url.pathname.replace(REFERENCE_PATH, '').split('/')

    if (clientSdkIds.includes(lib)) {
      const version = /v\d+/.test(maybeVersion) ? maybeVersion : undefined
      if (!version) {
        slug = [maybeVersion, ...slug]
      }

      if (slug.length > 0) {
        const rewriteUrl = new URL(url)
        rewriteUrl.pathname = (BASE_PATH ?? '') + '/api/crawlers'

        return NextResponse.rewrite(rewriteUrl)
      }
    }
  } else {
    const [, lib, maybeVersion] = url.pathname.replace(REFERENCE_PATH, '').split('/')

    if (lib === 'cli') {
      const rewritePath = [REFERENCE_PATH, 'cli'].join('/')
      return NextResponse.rewrite(new URL(rewritePath, request.url))
    }

    if (lib === 'api') {
      const rewritePath = [REFERENCE_PATH, 'api'].join('/')
      return NextResponse.rewrite(new URL(rewritePath, request.url))
    }

    if (lib?.startsWith('self-hosting-')) {
      const rewritePath = [REFERENCE_PATH, lib].join('/')
      return NextResponse.rewrite(new URL(rewritePath, request.url))
    }

    if (clientSdkIds.includes(lib)) {
      const version = /v\d+/.test(maybeVersion) ? maybeVersion : null
      const rewritePath = [REFERENCE_PATH, lib, version].filter(Boolean).join('/')
      return NextResponse.rewrite(new URL(rewritePath, request.url))
    }
  }

  return NextResponse.next()
}

// export const config = {
//   matcher: '/((?!api|_next|static|public|favicon.ico).*)',
// }
