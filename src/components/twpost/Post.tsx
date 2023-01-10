import React from 'react'
import { RouterOutputs, trpc } from '../../utils/trpc'
import Image from 'next/image'
function Tweet({
  tweet,
  // client,
  // input
}:{tweet:RouterOutputs['tweet']['timeline']['tweets'][number]}){
  let imgUrlsObject ={...tweet.imgsTw}
  // console.log(imgUrlsObject[0]?.url)
  

  return( 
    <div>
      <div>
        ....................................................
      </div>
      <div className=' flex flex-col'>
        {tweet.author.image &&
          <img src={tweet.author.image} alt={`${tweet.author.name} profile picture`}  className='rounded-full w-[40px] h-[40px]' />
        }
        {/* text */}
        <div>
        {
          tweet.text &&
          <div className='text-sm text-gray-600'>
            {tweet.text}
          </div>

        }
        </div>
        <div>
          {imgUrlsObject[0]  &&
            tweet.imgsTw.map((url,index) =>(
            
              <img src={imgUrlsObject[index]?.url} alt={`${tweet.author.name} profile picture`} />
            ))
          }
        </div>
        <div>
          {/* <img src="blob:http://localhost:3000/b3e587f2-be70-4fc5-91c9-9b417e5aeb10" alt="dd" /> */}
        </div>
      </div>
      <div>
        
      </div>
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