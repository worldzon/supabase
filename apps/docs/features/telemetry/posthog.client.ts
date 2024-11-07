import 'server-only'

import { PostHog } from 'posthog-node'

/**
 * TELEMETRY CLIENT
 */

type TelemetryClient = PostHog

interface IO {
  telemetryClient: () => TelemetryClient
}

let posthog: PostHog | undefined

function telemetryClient() {
  if (!posthog) {
    posthog = new PostHog(process.env.POSTHOG_PROJECT_API_KEY, {
      host: 'https://eu.i.posthog.com',
      personalApiKey: process.env.POSTHOG_API_KEY,
    })
  }
  return posthog
}

export const defaultTelemetryIo: IO = {
  telemetryClient,
}

/**
 * FEATURE FLAGS
 */

export const FEATURE_FLAGS = {
  CHARIS_TEST: 'charis_test',
} as const
type FeatureFlag = keyof typeof FEATURE_FLAGS

export function isFeatureEnabled(flag: FeatureFlag, id: string, io: IO) {
  return io.telemetryClient().isFeatureEnabled(flag, id)
}
