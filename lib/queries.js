const postFields = `
_id,
title,
mainImage,
categories[]->{
    _id,
    title
},
"slug": slug.current
`

export const postQuery = `
{
  "post": *[_type == "post" && _id == $postId] | order(_updatedAt desc) | [0] {
    body,
    ${postFields}
  },
}`

export const postSlugsQuery = `
*[_type == "post" && defined(slug.current)]{'slug': slug.current, 'postId': _id}
`

export const postByIdQuery = `
*[_type == "post" && _id == $postId][0] {
  ${postFields}
}
`
