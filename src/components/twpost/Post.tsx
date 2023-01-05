import { Router } from 'next/router'
import React from 'react'
import { RouterOutputs, trpc } from '../../utils/trpc'
import Image from 'next/image'
function Tweet({
  tweet,
  // client,
  // input
}:{tweet:RouterOutputs['tweet']['timeline']['tweets'][number]}){
  console.log(tweet.imgsTw[0]?.url);

  return(
    <div className=' flex flex-col'>
      {tweet.author.image &&
        <img src={tweet.author.image} alt={`${tweet.author.name} profile picture`}  className='rounded-full w-[40px] h-[40px]' />
      }
      
    </div>
  )
}



const Post = () => {

  const { data } = trpc.tweet.timeline.useQuery({
    limit: 2,
  })
  
  return (
    
    <div>
      {data && JSON.stringify(data)}
      <div className='w-full pointer-events-auto relative border-b border-bordercl shrink-0 grow-0 basis-auto flex flex-col '>
        <div className='css-intial'>
          <article className='px-4'>
            <div className='flex flex-col pointer-events-auto relative shrink-0 basis-auto'>
              {/* avatar */}
              <div className='text-lg font-bold'>
                avatar
                
              </div>
              {/* tweet */}
              {/* {JSON.stringify(data)} */}
              {data?.tweets.map((tweet) => {
                return <Tweet key={tweet.id} tweet={tweet} ></Tweet>
              })}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Post