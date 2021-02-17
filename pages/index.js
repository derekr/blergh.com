import Link from 'next/link'

import { postIndexByLastUpdated } from '../lib/queries'
import { getClient } from '../lib/sanity.server'

export default function Home({ data }) {
  return (
    <div className="prose mx-auto lg:mt-14">
      <ol>
        {data.postsByLastUpdate.map((post) => {
          return (
            <li key={post._id}>
              <Link href={`/p/${post.slug}/${post._id}`}>{post.title}</Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export async function getStaticProps() {
  const data = await getClient().fetch(postIndexByLastUpdated)

  return {
    props: {
      data,
    },
  }
}
