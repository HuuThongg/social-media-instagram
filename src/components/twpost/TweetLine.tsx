import React,{useEffect, useState} from 'react'
import Tweet from './Tweet'
import type { RouterInputs} from '../../utils/api';
import { api as trpc } from '../../utils/api'
import {
  useQueryClient,
} from "@tanstack/react-query";

const LIMITTWEETS = 3;

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const winScroll =
      document.documentElement.scrollTop;
    const scrolled = (winScroll / height) * 100;
    setScrollPosition(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}

const TweetLine = ({where = {}}:{where: RouterInputs['tweet']['timeline']['where']}) => {
  const scrollPosition = useScrollPosition();
  const { data, hasNextPage ,fetchNextPage, isFetching, refetch: refetchSingleTweet} = trpc.tweet.timeline.useInfiniteQuery({
    limit: LIMITTWEETS,
    where
  },{
    getNextPageParam: (lastPage)=> lastPage.nextCursor 
  })

  // refetchSingleTweet();
  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  const client = useQueryClient();

  const  tweetData = data?.pages.flatMap((page)=>page.tweets) ??[];

  const utils = trpc.useContext();
  return (
    <div>
      <div className='w-full pointer-events-auto relative border-b border-bordercl shrink-0 grow-0 basis-auto flex flex-col '>
        <div className='css-intial'>
          <article className='px-4'>
            <div className='flex flex-col pointer-events-auto relative shrink-0 basis-auto'>
              {/* avatar */}
              <div className='text-lg font-bold'>
                avatar

              </div>
              {/* tweet */}
              {tweetData?.map((tweet) => {
                return <Tweet key={tweet.id} tweet={tweet} input={{ where, limit:LIMITTWEETS }}  client={client} utils={utils}
                ></Tweet>
              })}
            </div>
          </article>
        </div>
      </div>
      
    </div>
    
  )
}

export default TweetLine