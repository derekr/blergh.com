const previewSecret = 'testing' // Copy the string you used for SANITY_PREVIEW_SECRET
const projectUrl = 'http://localhost:3000'

export default function resolveProductionUrl(document) {
  return `${projectUrl}/api/preview?secret=${previewSecret}&postId=${document._id}`
}
