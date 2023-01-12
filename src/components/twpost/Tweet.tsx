import { QueryClient , InfiniteData} from '@tanstack/react-query';
import Link from 'next/link';

import React from 'react'
import { RouterOutputs, RouterInputs, trpc } from '../../utils/trpc'
import Interaction from './Interaction';
// import Image from 'next/image'

function updateCache({
  client,
  variables,
  data,
  action,
  input,
}: {
  client: QueryClient;
  // input: RouterInputs["tweet"]["timeline"];
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
  input: RouterInputs["tweet"]["timeline"];
}) {
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        // input: {
        //   limit: 3,
        //   where:{},
        // },
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      console.log(oldData);
      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;

      const value = action === "like" ? 1 : -1;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                like: action === "like" ? [data.userId] : [],
                _count: {
                  like: tweet._count.like + value,
                },
              };
            } 

            return tweet;
          }),
        };
      });
      const a = {...newData,page:newTweets}
      console.log(a)
      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

function Tweet({
  tweet,
  client,
  input
}:{tweet:RouterOutputs['tweet']['timeline']['tweets'][number];
client: QueryClient;
    input: RouterInputs["tweet"]["timeline"];
}){

  const tweetId : string = tweet.id;
  
  const { data: images} = trpc.tweet.getImagesForUser.useQuery({ tweetId });

  const likeMutation = trpc.tweet.like.useMutation({
    onSuccess:(data, variables)=>{
      updateCache({ client, variables, data, action:"like",input});
    },
  }).mutateAsync;
  const unlikeMutation = trpc.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "unlike",input });
    },
  }).mutateAsync;
  const hasLike = tweet.like.length > 0;
  return( 
    <div className='border-t border-bordercl pt-2'>
      <div className='flex flex-col'>
        <div className='flex '>
          <Link href={`/${tweet.author.name}`}>
          {tweet.author.image &&
            <img src={tweet.author.image} alt={`${tweet.author.name} profile picture`}  className='rounded-full w-[40px] h-[40px]' />
          }
          </Link>

          {/* text */}
          <div className='ml-2 '>
          {
            tweet.text &&
            <div className='text-sm text-gray-600'>
              {tweet.text}
            </div>

          }
          </div>
        </div>
        <div>
          {/* {imgUrlsObject[0]  &&
            tweet.imgsTw.map((url,index) =>(
            
              <img src={imgUrlsObject[index]?.url} alt={`${tweet.author.name} profile picture`} />
            ))
          } */}
        </div>
        <div>
          {images && images.map(image => (
                <div key={image.id} className='col-span-4'>
                  <img src={image.url} alt="alt" />
                </div>
              ))}
        </div>
      </div>
      <div>
        <Interaction likeFn ={likeMutation} unlikeFn ={unlikeMutation} tweetId ={tweetId} hasLike = {hasLike} twCreateAt={tweet.createdAt} likeCount ={tweet._count.like}/>
      </div>
    </div>
  )
}

export default Tweet