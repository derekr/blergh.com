import { GetStaticProps, GetStaticPaths } from 'next'
import { getDataHooksProps } from 'next-data-hooks'

import Post from 'routes/p/components/post'
import { postSlugsQuery } from 'lib/queries'
import { getClient } from 'lib/sanity.server'

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getClient().fetch(postSlugsQuery)

  return {
    paths: paths.map(({ slug, postId }) => ({ params: { slug, postId } })),
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
