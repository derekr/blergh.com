import {
  createImageUrlBuilder,
  createPreviewSubscriptionHook,
  createPortableTextComponent,
} from 'next-sanity'
import { sanityConfig } from './config'

export const imageBuilder = createImageUrlBuilder(sanityConfig)

export const urlForImage = (source) =>
  imageBuilder.image(source).auto('format').fit('max')

export const usePreviewSubscription = createPreviewSubscriptionHook(
  sanityConfig
)

export const PortableText = createPortableTextComponent({
  ...sanityConfig,
  // Serializers passed to @sanity/block-content-to-react
  // (https://github.com/sanity-io/block-content-to-react)
  serializers: {},
})
