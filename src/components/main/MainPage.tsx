import React from 'react'
import { Posts } from '../post'
import { Stories } from '../story'

const MainPage = () => {
  return (
    <div className='w-[calc(100%-244px)] 3xl:w-[calc(100%-335px)] ml-auto '>
      <section className=' flex flex-col min-h-screen overflow-x-hidden'>
        {/* odder -4  */}
        <main className='flex flex-col grow bg-bgCl w-full '>
          <div>
            <section className='pt-0 flex flex-nowrap grow w-full relative align-baseline p-0 my-0 mx-auto max-w-[calc(470px+32px+319px)]  '>
              {/* transform translate y -56px? */}
              <div className='shrink-0 mr-[32px] max-w-[470px] w-full float-left  mt-5'>
                {/* stoeies */}
                  <Stories/>
                  <div className='mt-2'>

                    {/* posts */}
                    <Posts/>
                  </div>
              </div>
              {/* <div className='bg-red-300 absolute top-[30px] right-0 h-screen mb-[30px] p-0 shrink-0 w-[319px] '>
                b
              </div> */}
            </section>
          </div>
        </main>
      </section>
    </div>
  )
}

export default MainPage