import type { QueryClient , InfiniteData} from '@tanstack/react-query';
import Link from 'next/link';

import React from 'react'
import type { RouterOutputs, RouterInputs } from '../../utils/api';
import {api as trpc } from '../../utils/api';
import Interaction from './Interaction';
import Image from 'next/image'

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
      console.log("oldData",oldData);
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
  input,
  // utils
}:{tweet:RouterOutputs['tweet']['timeline']['tweets'][number];
client: QueryClient;
    input: RouterInputs["tweet"]["timeline"];
    // utils: typeof trpc.useContext
}){
  const utils = trpc.useContext();

  const tweetId : string = tweet.id;
  // const { data: images } = trpc.tweet.getImagesForUser.useQuery({ tweetId });
  const { data: images, isFetched } = trpc.tweet.getImagesForUser.useQuery({ tweetId });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const likeMutation :(variables: { tweetId: string }) => void = trpc.tweet.like.useMutation({
    onSuccess:(data, variables)=>{
      updateCache({ client, variables, data, action:"like",input});
    },
  }).mutateAsync;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const unlikeMutation: (variables: { tweetId: string }) => void = trpc.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "unlike",input });
    },
  }).mutateAsync;

  const {mutateAsync : deleteTweet, } = trpc.tweet.deleteTweet.useMutation({
    onSuccess: async () => {
      await utilss.tweet.timeline.invalidate();
    },
  })
  const {mutateAsync : deleteImage} = trpc.tweet.deleteImage.useMutation()
  const handleDeleteTweet =async () =>{
    await Promise.all([
      deleteTweet({ tweetId }),
      deleteImage({ tweetId })
    ]);
  }

  const hasLike :boolean = tweet.like.length > 0;


  return( 
    <div className='border-t border-bordercl pt-2'>
      <div className='flex flex-col'>
        <div className='flex '>
          <Link href={`/${tweet.author.name}`}>
          {tweet.author.image &&
            <Image src={tweet.author.image} alt={`${tweet.author.name} profile picture`}  className='rounded-full'
            width={40}
            height={40} />
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
          {/* delete */}
          <button onClick={handleDeleteTweet} className='ml-auto'> delete</button>
        </div>
        <div>
          
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
        <Interaction likeFn={likeMutation} unlikeFn={unlikeMutation} tweetId={tweetId} hasLike={hasLike} twCreateAt={tweet.createdAt} likeCount={tweet._count.like} commentCount ={tweet._count.comment}  commentData={tweet.comment}   />
      </div>
    </div>
  )
}

export default Tweet