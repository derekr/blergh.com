import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { groq } from 'next-sanity'
import {
  getClient,
  usePreviewSubscription,
  urlFor,
  PortableText,
} from '../../../lib/sanity'

const postQuery = groq`
  *[_type == "post" && _id == $postId][0] {
    _id,
    title,
    body,
    mainImage,
    categories[]->{
      _id,
      title
    },
    "slug": slug.current
  }
`

export default function Post({ data, preview }) {
  const router = useRouter()
  if (!router.isFallback && !data.post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  console.log(data)

  const { data: { post } } = usePreviewSubscription(postQuery, {
    params: { postId: data?.post?._id },
    initialData: data,
    enabled: preview,
  })

  console.log(post)

  const { title, mainImage, body } = post
  return (
    <article>
      <h2>{title}</h2>
      <figure>
        <img src={urlFor(mainImage).url()} />
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
  )
}

export async function getStaticProps({ params, preview = false }) {
  const post = await getClient(true).fetch(postQuery, {
    postId: params.postId,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview,
      data: { post },
    },
  }
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "post" && defined(slug.current)]{ 'slug': slug.current, 'postId': _id }`
  )

  return {
    paths: paths.map(({ slug, postId }) => ({ params: { slug, postId } })),
    fallback: true,
  }
}
