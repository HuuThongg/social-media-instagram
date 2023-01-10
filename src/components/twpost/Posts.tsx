import React from 'react'
import Post from './Post'

const Posts = ({ key, imageUrl }) => {
  return (
    <Post key={key} imageUrl={imageUrl}  />
    
  )
}

export default Posts