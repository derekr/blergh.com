import Link from 'next/link'
import { createDataHook } from 'next-data-hooks'

import { postIndexByLastUpdated } from 'lib/queries'
import client from 'lib/sanity-client'
import { Post } from 'lib/schema'

const useHomeData = createDataHook(
    'Home',
    async () => {
      const posts = await client.query<Post>(postIndexByLastUpdated)

      return {
        posts
      }
    }
  )

export default function Home() {
    const { posts } = useHomeData()

  return (
    <div className="prose mx-auto lg:mt-14">
      <ol>
        {posts.map((post) => {
          return (
            <li key={post._id}>
              <Link href={`/p/${post.slug}/${post._id}`}>{post.title}</Link>
              <div>
                Last updated:{' '}
                {new Intl.DateTimeFormat().format(new Date(post._updatedAt))}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

Home.dataHooks = [useHomeData]