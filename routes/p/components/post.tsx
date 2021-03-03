import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { createDataHook } from 'next-data-hooks'
import hydrate from 'next-mdx-remote/hydrate';

import { postQuery } from 'lib/queries'
import { urlForImage, usePreviewSubscription } from 'lib/sanity'

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

    const renderToString = require('next-mdx-remote/render-to-string')

    const content = await renderToString(post.body, {
      components: {
        Test: () => <div>TEST</div>
      }
    })

    return {
      post: { ...post, body: content },
      preview,
    }
  }
)

const PostDetail = () => {
  const { post: initialPost, preview } = usePostData()

  const {
    data: { post },
  } = usePreviewSubscription(postQuery, {
    params: { postId: `${initialPost?._id}` },
    initialData: { post: initialPost },
    enabled: preview && Boolean(initialPost),
  })

  if (!post._id) {
    return <ErrorPage statusCode={404} />
  }

  const { title, mainImage, body } = post

  const content = hydrate(body, {
    components: {
      Test: () => <div>TEST</div>
    }
  })

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
        { content }
        <aside></aside>
      </article>
    </>
  )
}

export default function Post() {
  const router = useRouter()

  if (router.isFallback) {
    return <div>loading…</div>
  }

  return <PostDetail />
}

Post.dataHooks = [usePostData]
