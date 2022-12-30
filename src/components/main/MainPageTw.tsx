import React from 'react'
import Post from '../twpost/Post'

const MainPageTw = () => {
  return (
    <main className='flex flex-col p-0 m-0 border-none grow shrink basis-auto  text-[15px] relative w-[1197px] bg-bgcl pointer-events-auto'>
      <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
        {/* content */}
        <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl bg-red-200 min-h-screen h-full pointer-events-auto'>
          {/* Home */}
          <div className='sticky  top-0 z-[3] pointer-events-auto text-[15px]'>
            <div className='h-[53px] max-w-[1000px] cursor-pointer flex p-4 w-full items-center justify-start mx-auto'>
              <h1 className='text-[20px] leading-6'>
                <span className='block'>Home</span>
              </h1>
            </div>
          </div>
          {/* new tweet */}
          <div className='css-intial  pointer-events-auto  bg-slate-400'>
            <div className='pb-1'>
              <div className='flex  py-1 w-full h-[116px] relative  '>
                {/* avatar */}
                <div className='flex flex-col  mt-1 mr-3  w-[48px] z-0 relative bg-black '>
                  <div className='pb-[100%] pointer-events-auto block'>
                  </div>
                  <div className='absolute top-0 left-0 w-[48px] h-[48px]'>
                    <div className='w-full h-full'>
                      <img className='rounded-full' src="https://pbs.twimg.com/profile_images/1445059468081778694/WlufQTvC_x96.png" alt="" />
                    </div>
                  </div>
                </div>
                {/* right side of create tweet */}
                <div className='css-intial pt-1'>
                  {/* text */}
                  <div className='h-[56px]'>
                    <div className='m-[2px] w-full'>
                      <div className='py-3'>
                        What's happening?
                      </div>
                    </div>

                  </div>
                  {/* things added to a post */}
                  <div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <section>
            <Post/>
          </section>
        </div>
        {/* search */}
      </div>
    </main>
  )
}

export default MainPageTw