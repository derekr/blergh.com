import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { createDataHook } from 'next-data-hooks'

import { postQuery } from 'lib/queries'
import { urlForImage, PortableText, usePreviewSubscription } from 'lib/sanity'

import client from 'lib/sanity-client'

const usePostData = createDataHook(
  'Post',
  async ({ params, preview = false }) => {
    const post = await client.get('post', params.postId as string)

    if (!post) {
      return {
        notFound: true,
      }
    }

    return {
      post: post,
      preview,
    }
  }
)

export default function Post() {
  const router = useRouter()
  const { post: initialPost, preview } = usePostData()

  const {
    data: { post },
  } = usePreviewSubscription(postQuery, {
    params: { postId: `${initialPost?._id}` },
    initialData: { post: initialPost },
    enabled: preview && Boolean(initialPost),
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

Post.dataHooks = [usePostData]
