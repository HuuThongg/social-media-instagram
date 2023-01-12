import Link from 'next/link'

import { FiHeart, FiMessageSquare, FiSend, FiBookmark } from 'react-icons/fi'

import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

const Interaction = ({ tweetId, likeFn, unlikeFn, hasLike, twCreateAt, likeCount }) => {
  return (
    <div className='shrink-0 grow-0 basis-auto  flex flex-col justify-start '>
      <div className=' rounded-lg pointer-events-auto relative bg-primary_bg '>
        <div className='flex flex-col min-w-[335px] w-full'>
          {/* reactions */}
          <section className='flex mt-1 px-3 pb-[6px] pointer-events-auto'>
            <span className='inline-block -ml-2'>
              <button className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[24px] '
                onClick={() => {
                  !hasLike ? likeFn({ tweetId }) : unlikeFn({ tweetId })
                }} 
              >
                <FiHeart className={hasLike ? "fill-red-500" : "fill-none"} />
              </button>
            </span>
            <span className='inline-block '>
              <button className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[24px]'>
                <FiMessageSquare />
              </button>
            </span>
            <span className='inline-block '>
              <button className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[24px]'>
                <FiSend />
              </button>
            </span>
            <span className='inline-block ml-auto -mr-[10px] align-baseline '>
              <button className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[24px]'>
                <FiBookmark />
              </button>
            </span>
          </section>
          {/* likes */}
          <section className='px-3 mb-2'>
            <div className='flex space-x-2'>
              <span>{likeCount}</span>
              <p>likes</p>
            </div>
          </section>
          {/* content */}
          <div className=' mx-0 mt-0 mb-auto px-3 overflow-auto relative'>
            <div className='shrink-0 grow-0 basis-auto flex flex-col justify-start relative mb-1'>
              <div className=' flex-auto min-h-0 min-w-0 relative'>
                <span className='inline relative'>
                  <Link href="#" className='font-semibold inline'>huuthong</Link>
                  { } Javascript is everywhere. Millions of webpages are built on JS.
                </span>
                <span className='inline'>
                  <span>
                    <br />

                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum suscipit illo, commodi minus laborum
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, aut!
                    <br />
                    <br />
                  </span>
                  <span className=''>
                    ...&nbsp;
                    <div className='cursor-pointer text-[14px] pointer-events-auto font-normal inline'>
                      <div className='inline'>
                        more
                      </div>
                    </div>
                  </span>
                </span>
              </div>
            </div>
            {/* comments */}
            {/* vuew all  comments */}
            <div className='mb-1'>
              <Link href="#" className='w-full text-secondary_text '>View all 14 comments</Link>
            </div>
            {/* show comments */}
            <div className='shrink-0 grow-0 flex flex-col mb-1'>
              {/* each comment */}
              <div className=' shrink-0 grow-0 flex justify-start mb-1 items-center'>
                <div className='w-full flex-auto'>
                  <span>
                    <Link href="#">HuuThong </Link>
                  </span>
                  {/* comment */}
                  <span className='text-slate-500'> i m le huu thong</span>
                </div>
                <span>
                  <FiHeart />
                </span>
              </div>
              {/* each comment */}
              <div className=' shrink-0 grow-0 flex justify-start mb-1 items-center'>
                <div className='w-full flex-auto'>
                  <span>
                    <Link href="#">HuuThong </Link>
                  </span>
                  {/* comment */}
                  <span className='text-slate-500'> Are you okay</span>
                </div>
                <span>
                  <FiHeart />
                </span>
              </div>
            </div>
          </div>
          {/* time */}
          <div className=' pl-3 mb-3 pointer-events-auto'>
            <div className='text-secondary_text text-[14px]'>
              <span className='block text-[12px]'>{dayjs(twCreateAt).fromNow()}</span>
            </div>
          </div>

          {/* add comments */}
          <section className='px-3 py-1 border-t border-solid border-separate border-neutral-300 text-[14px] shrink-0 text-secondary_text relative'>
            <div>
              <form action="" className=' flex boder-0 border-none m-0 p-0 relative align-baseline'>
                <textarea className=' h-[18px] b grow-border-none outline-none resize-none active:border-none active:outline-none text-start whitespace-pre-wrap w-full rounded-none text-slate-700 appearance-none' placeholder='Add a comment...' >

                </textarea>

              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Interaction