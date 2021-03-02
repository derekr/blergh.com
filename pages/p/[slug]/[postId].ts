import { GetStaticProps, GetStaticPaths } from 'next'
import { getDataHooksProps } from 'next-data-hooks'

import Post from 'routes/p/components/post'
import client from 'lib/sanity-client'

export const getStaticPaths: GetStaticPaths = async () => {
  client.setPreviewMode(false)
  const posts = await client.getAll('post')

  return {
    paths: posts.map(({ slug, _id }) => ({
      params: { slug: slug.current, postId: _id },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const dataHooksProps = await getDataHooksProps({
    context,
    dataHooks: Post.dataHooks,
  })

  return { props: dataHooksProps }
}

export default Post
