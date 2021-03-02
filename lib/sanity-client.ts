import fetch from 'isomorphic-fetch'

// sanity-client.ts
import { createClient } from 'sanity-codegen'
import { Documents } from './schema'

import { sanityConfig } from './config'

export default createClient<Documents>({
  // Note: these are useful to pull from environment variables
  // (required) your sanity project id
  projectId: sanityConfig.projectId,
  // (required) your sanity dataset
  dataset: sanityConfig.dataset,
  // (required) the fetch implementation to use
  fetch: fetch,
  //
  // (optional) if true, the client will prefer drafts over the published versions
  previewMode: true,
  // (optional) only required if your dataset is private or if you want to use preview mode
  token: process.env.SANITY_API_TOKEN,
  // by default sanity-codegen caches responses in memory. this can be disabled if desired
  // disabledCache: true,
})
