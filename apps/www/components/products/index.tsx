import Solutions from 'data/Solutions'
import Telemetry from '~/lib/telemetry'
import gaEvents from '~/lib/gaEvents'
import { useTelemetryProps } from 'common/hooks/useTelemetryProps'
import { useRouter } from 'next/router'
import Image from 'next/image'
import SectionContainer from '../Layouts/SectionContainer'
import { useBreakpoint } from 'common'
import ProductCard from './ProductCard'
import DatabaseVisual from './DatabaseVisual'
import { IconCheck } from 'ui'

const opacityVariant = {
  default: { opacity: 1, filter: 'grayscale(1)', transition: { duration: 0.1 } },
  hover: {
    opacity: 1,
    filter: 'grayscale(0)',
    transition: { duration: 0.15 },
  },
}

const Products = (props: any) => {
  const router = useRouter()
  const telemetryProps = useTelemetryProps()

  const sendTelemetryEvent = async (product: any) => {
    switch (product) {
      case 'Database':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_database'],
          telemetryProps,
          router
        )
      case 'Authentication':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_auth'],
          telemetryProps,
          router
        )
      case 'Storage':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_storage'],
          telemetryProps,
          router
        )
      case 'Edge Functions':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_edgeFunctions'],
          telemetryProps,
          router
        )
      case 'Realtime':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_realtime'],
          telemetryProps,
          router
        )
    }
  }
  const isSm = useBreakpoint(640)

  return (
    <SectionContainer className="space-y-8 mt-0 lg:mt-0 !pt-0">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 lg:gap-6 md:grid-cols-4">
        <ProductCard
          alignLeft
          url={Solutions['database'].url}
          icon={Solutions['database'].icon}
          title={Solutions['database'].name}
          subtitle={Solutions['database'].description}
          highlights={
            <ul className="flex flex-col gap-1">
              <li>
                <IconCheck className="inline h-4 w-4" /> 100% portable
              </li>
              <li>
                <IconCheck className="inline h-4 w-4" /> Built-in Auth with RLS
              </li>
              <li>
                <IconCheck className="inline h-4 w-4" /> Easy to extend
              </li>
            </ul>
          }
          onClick={() => sendTelemetryEvent(name)}
          image={<DatabaseVisual />}
          classname="col-span-full md:col-span-2"
        />
        <ProductCard
          url={Solutions['authentication'].url}
          icon={Solutions['authentication'].icon}
          title={Solutions['authentication'].name}
          subtitle={
            <>
              Add user sign ups and logins,
              <br className="inline-block sm:hidden lg:inline-block" /> securing your data with Row
              Level Security.
            </>
          }
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/database.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          classname=""
          onClick={() => sendTelemetryEvent(name)}
        />
        <ProductCard
          url={Solutions['storage'].url}
          icon={Solutions['storage'].icon}
          title={Solutions['storage'].name}
          subtitle={<>Store, organize, and serve large files, from videos to images.</>}
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/storage.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          classname=""
          onClick={() => sendTelemetryEvent(name)}
        />
        <ProductCard
          url={Solutions['edge-functions'].url}
          icon={Solutions['edge-functions'].icon}
          title={Solutions['edge-functions'].name}
          subtitle={
            <>
              Easily write custom code
              <br className="inline-block sm:hidden lg:inline-block" /> without deploying or scaling
              servers.
            </>
          }
          onClick={() => sendTelemetryEvent(name)}
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/edge-functions.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          classname="!col-span-1"
        />
        <ProductCard
          url={Solutions['realtime'].url}
          icon={Solutions['realtime'].icon}
          title={Solutions['realtime'].name}
          subtitle={
            <>
              Build multiplayer experiences
              <br className="inline-block sm:hidden lg:inline-block" /> with realtime data
              synchronization.
            </>
          }
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/realtime-base.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          classname="!col-span-1 md:h-[350px] lg:h-[390px]"
        />
        <ProductCard
          alignLeft
          url={Solutions['vector'].url}
          icon={Solutions['vector'].icon}
          title={Solutions['vector'].name}
          subtitle={Solutions['vector'].description}
          onClick={() => sendTelemetryEvent(name)}
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src={
                  isSm
                    ? '/images/index/products/vector-centered.svg'
                    : '/images/index/products/vector.svg'
                }
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          classname="col-span-full md:col-span-2"
        />
      </dl>
    </SectionContainer>
  )
}

export default Products
