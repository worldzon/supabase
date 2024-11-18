import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import dayjs from 'dayjs'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Error from 'next/error'
import { createClient, Session } from '@supabase/supabase-js'
import { Button } from 'ui'
import { SITE_URL, LW_URL } from '~/lib/constants'
import supabase from '~/lib/supabase'
import { Database } from '~/lib/database.types'
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion'
import { DEFAULT_TRANSITION, INITIAL_BOTTOM, getAnimation } from '~/lib/animations'
import MetalTicket from '~/components/LaunchWeek/13/MetalTicket'

import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'
import { TicketState, ConfDataContext, UserData } from '~/components/LaunchWeek/hooks/use-conf-data'
import CanvasSingleMode from '~/components/LaunchWeek/13/Multiplayer/CanvasSingleMode'
import classNames from 'classnames'

interface Props {
  user: UserData
  users: UserData[]
  ogImageUrl: string
}

export default function UsernamePage({ user, ogImageUrl }: Props) {
  const { username, ticket_number: ticketNumber, name } = user

  const DISPLAY_NAME = name || username
  const FIRST_NAME = DISPLAY_NAME?.split(' ')[0]
  const TITLE = `${DISPLAY_NAME ? DISPLAY_NAME.split(' ')[0] + '’s' : 'Get your'} Launch Week Ticket`
  const DESCRIPTION = `Claim your Supabase Launch Week 13 ticket for a chance to win supa swag.`
  const PAGE_URL = `${LW_URL}/tickets/${username}`

  const [session] = useState<Session | null>(null)
  const [ticketState, setTicketState] = useState<TicketState>('ticket')
  // const { resolvedTheme, setTheme } = useTheme()

  // const isDark = resolvedTheme?.includes('dark')
  // const isDarkTheme = resolvedTheme === 'dark'

  // useEffect(() => {
  //   isDarkTheme && setTheme('deep-dark')
  // }, [isDarkTheme])

  // useEffect(() => {
  //   return () => {
  //     isDark && setTheme('dark')
  //   }
  // }, [])

  const transition = DEFAULT_TRANSITION
  const initial = INITIAL_BOTTOM
  const animate = getAnimation({ duration: 1 })
  const exit = { opacity: 0, transition: { ...transition, duration: 0.2 } }

  if (!ticketNumber) {
    return <Error statusCode={404} />
  }

  return (
    <>
      <NextSeo
        title={TITLE}
        openGraph={{
          title: TITLE,
          description: DESCRIPTION,
          url: PAGE_URL,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <ConfDataContext.Provider
        value={{
          supabase,
          session,
          userData: user,
          setUserData: () => null,
          ticketState,
          setTicketState,
        }}
      >
        <DefaultLayout className="lg:h-[calc(100dvh-65px)] min-h-[calc(100dvh-65px)] overflow-hidden">
          <SectionContainer className="relative h-full flex-1 pt-4 md:pt-4 pointer-events-none">
            <div className="relative z-10 flex h-full">
              <LazyMotion features={domAnimation}>
                <AnimatePresence mode="wait" key={ticketState}>
                  <m.div
                    key="ticket"
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    className="w-full flex-1 h-full flex flex-col lg:flex-row items-center lg:justify-center lg:items-center gap-8 md:gap-10 lg:gap-32 text-foreground text-center md:text-left"
                  >
                    <div className="w-full lg:w-full h-full mt-3 md:mt-6 lg:mt-0 max-w-lg flex flex-col items-center justify-center gap-3"></div>
                    <div className="lg:h-full w-full max-w-lg gap-8 flex flex-col items-center justify-center lg:items-start lg:justify-center text-center lg:text-left">
                      <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start gap-2 text-foreground text-center md:text-left max-w-sm">
                        <h1 className="text-foreground text-2xl">
                          {DISPLAY_NAME?.split(' ')[0]}'s Ticket
                        </h1>
                        <span className="text-foreground-light text-2xl">
                          Join {FIRST_NAME} for Supabase Launch Week 13. Claim your ticket for a
                          chance to win limited swag.
                        </span>
                      </div>
                      <div>
                        <Button type="primary" asChild size="small">
                          <Link
                            href={`${SITE_URL}${username ? '?referral=' + username : ''}`}
                            className="pointer-events-auto"
                          >
                            Claim your ticket
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </m.div>
                </AnimatePresence>
              </LazyMotion>
            </div>
          </SectionContainer>
          <CanvasSingleMode />
          <MetalTicket
            username={DISPLAY_NAME ?? ''}
            className="relative -mt-56 -mb-20 lg:my-0 lg:absolute"
            ticketPosition="left"
          />
        </DefaultLayout>
      </ConfDataContext.Provider>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = params?.username?.toString() || null
  let user

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.LIVE_SUPABASE_COM_SERVICE_ROLE_KEY!
  )

  const SITE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  // fetch the normal ticket
  // stores the og images in supabase storage
  fetch(`${SITE_URL}/api-v2/ticket-og?username=${encodeURIComponent(username ?? '')}`)

  // supabaseAdmin.functions.invoke(`lw13-ticket-og?username=${encodeURIComponent(username ?? '')}`)

  // fetch a specific user
  if (username) {
    const { data } = await supabaseAdmin!
      .from('tickets_view')
      .select('name, username, ticket_number, metadata, platinum, secret, role, company, location')
      .eq('launch_week', 'lw13')
      .eq('username', username)
      .single()

    user = data
  }

  // fetch the platinum ticket
  // stores the og images in supabase storage
  if (user?.secret) {
    fetch(`${SITE_URL}/api-v2/ticket-og?username=${encodeURIComponent(username ?? '')}&secret=true`)
  } else if (user?.platinum) {
    // fetch /api-v2/ticket-og
    fetch(
      `${SITE_URL}/api-v2/ticket-og?username=${encodeURIComponent(username ?? '')}&platinum=true`
    )
  }

  const ticketType = user?.secret ? 'secret' : user?.platinum ? 'platinum' : 'regular'
  const ogImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/launch-week/lw13/og/${ticketType}/${username}.png?t=${dayjs(new Date()).format('DHHmmss')}`

  return {
    props: {
      user: {
        ...user,
        username,
      },
      ogImageUrl,
      key: username,
    },
    revalidate: 5,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return Promise.resolve({
    paths: [],
    fallback: 'blocking',
  })
}
