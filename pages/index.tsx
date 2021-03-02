import { GetStaticProps } from 'next'
import { getDataHooksProps } from 'next-data-hooks'

import Home from 'routes/home'

export const getStaticProps: GetStaticProps = async (context) => {
  const dataHooksProps = await getDataHooksProps({
    context,
    dataHooks: Home.dataHooks,
  })

  return {
    props: dataHooksProps,
  }
}

export default Home