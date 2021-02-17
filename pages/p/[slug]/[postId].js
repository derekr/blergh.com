import ErrorPage from 'next/error'
import { useRouter } from 'next/router'

import { postQuery, postSlugsQuery } from '../../../lib/queries'
import {
  usePreviewSubscription,
  urlForImage,
  PortableText,
} from '../../../lib/sanity'
import { getClient } from '../../../lib/sanity.server'

export default function Post({ data, preview }) {
  if (!data) return null

  const router = useRouter()

  const {
    data: { post },
  } = usePreviewSubscription(postQuery, {
    params: { postId: `${data?.post?._id}` },
    initialData: data,
    enabled: preview && data,
  })

  if (!router.isFallback && !post._id) {
    return <ErrorPage statusCode={404} />
  }

  const { title, mainImage, body } = post
  return (
    <>
      {preview && (
        <div>
          This page is a preview.{' '}
          <a
            href="/api/exit-preview"
            className="underline hover:text-cyan duration-200 transition-colors"
          >
            Click here
          </a>{' '}
          to exit preview mode.
        </div>
      )}
      <article className="prose lg:prose-xl mx-auto lg:mt-14">
        <h2>{title}</h2>
        <figure>
          <img src={urlForImage(mainImage).url()} />
        </figure>
        <PortableText
          blocks={body}
          serializers={{
            types: {
              code: (props) => (
                <pre data-language={props.node.language}>
                  <code>{props.node.code}</code>
                </pre>
              ),
            },
          }}
        />
        <aside></aside>
      </article>
    </>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getClient(preview).fetch(postQuery, {
    postId: `${preview ? 'drafts.' : ''}${params.postId}`,
  })

  if (!data?.post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview,
      data,
    },
  }
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(postSlugsQuery)

  return {
    paths: paths.map(({ slug, postId }) => ({ params: { slug, postId } })),
    fallback: true,
  }
}
