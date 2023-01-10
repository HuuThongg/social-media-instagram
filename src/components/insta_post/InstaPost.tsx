import { useState } from 'react'
import Link from 'next/link'
import { VscEllipsis } from 'react-icons/vsc'
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"
import { FiHeart, FiMessageSquare, FiSend, FiBookmark } from 'react-icons/fi'

const InstaPost = () => {

  const [amountXtoTranslate, setAmountXtoTranslate] =useState(0);

  const handleNext = () => {
    setAmountXtoTranslate(amountXtoTranslate + 470);
  }

  const handlePrev = () => {
    setAmountXtoTranslate(amountXtoTranslate - 470);

  }
  return (

    <article className='rounded-lg mb-3 bg-primary_bg border border-solid border-elevated_border -mx-[1px]'>
      <div className='flex flex-col justify-center relative text-[14px]'>
        {/* Onwer of the post */}
        <div className='border-b-[0.1px] bg-primary_bg rounded-lg'>
          <div className='flex justify-between items-center relative'>
            <header className=' flex my-2 ml-3 mr-1 items-center grow shrink  max-w-[calc(100%-48px)] relative '>
              <div className='block'>
                <span className='block w-8 h-8 text-sm'>
                  <Link href="#">
                    <img
                      className='w-8 h-8 object-cover rounded-full'
                      src="https://i.ibb.co/SrQSSpk/ag.jpg" alt="" />
                  </Link>
                </span>
              </div>
              <div className='ml-[10px] min-h-[40px] flex flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap '>

                <div className='p-[2px] grow shrink overflow-hidden align-baseline flex flex-col justify-center'>
                  huuthong
                </div>
              </div>
            </header>
            {/* features */}
            <div className='pr-1'>
              <button className='flex justify-center items-center p-2 cursor-pointer border-0 bg-transparent'>
                <div className='flex justify-center items-center'>
                  <VscEllipsis />
                </div>
                
              </button>
            </div>
          </div>
        </div>
        {/* content */}
        <div className=' bg-primary_bg flex flex-col pointer-events-auto relative'>
          <div className='flex flex-col shrink-0 m-0 p-0 align-baseline '>
            <div className='relative'>
              <div className='bg-red-200 pb-[125%]'>
                
              </div>
              <div className='absolute inset-0 flex flex-col justify-start'>
                <div className= 'box-border border-0 border-none flex flex-col shrink-0 h-full p-0 m-0 align-baseline w-full relative'>
                  
                  {/* representation img wrapper */}
                  <div className='flex h-full overflow-y-hidden overflow-x-auto scrollbar-hide'>
                    {/* img wrapper */}
                    <div className= 'box-border border-0 border-none flex flex-col shrink-0 h-full p-0 m-0 align-baseline w-full relative'>
                      <ul className='flex align-baseline'>
                        {/* <li className='w-[1px] translate-x-[4999px]'>

                        </li> */}
                        <li className={`translate-x-[${amountXtoTranslate}px] absolute inset-0`}>
                          <img
                          className='object-cover w-full h-full'
                          src='https://i.ibb.co/svzfcZm/content.jpg' alt="" />
                        </li>
                        <li className={`translate-x-[${amountXtoTranslate + 470}px] absolute inset-0`}>
                          <img
                            className='object-cover w-full h-full'
                            src='https://i.ibb.co/KmCBSmC/b.jpg' alt="" />
                        </li>
                      </ul>


                      
                    </div>
                  </div>
                  <button className='absolute bg-transparent py-4 px-2 top-1/2 -translate-y-1/2'
                  onClick={handlePrev}
                  >
                    <div className='rounded-full bg-slate-200 text-lg p-1'>
                      <HiChevronLeft/>
                    </div>
                  </button>
                  <button className='absolute bg-transparent py-4 px-2 top-1/2 right-0 -translate-y-1/2'
                  onClick={handleNext}

                  >
                    <div className='rounded-full bg-slate-200 text-lg p-1'>
                      <HiChevronRight />
                    </div>
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        {/* interactiviy */}
        <div className='shrink-0 grow-0 basis-auto  flex flex-col justify-start '>
          <div className=' rounded-lg pointer-events-auto relative bg-primary_bg '>
            <div className='flex flex-col min-w-[335px] w-full'>
              {/* reactions */}
              <section className='flex mt-1 px-3 pb-[6px] pointer-events-auto'>
                <span className='inline-block -ml-2'>
                  <button className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[24px]'>
                    <FiHeart />
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
                  <span>399</span>
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
                      <FiHeart/>
                    </span>
                  </div>
                </div>
              </div>
              {/* time */}
              <div className=' pl-3 mb-3 pointer-events-auto'>
                <div className='text-secondary_text text-[14px]'>
                  <span className='block text-[12px]'>1 DAY AGO</span>
                </div>
              </div>
              
              {/* add comments */}
              <section className='px-3 py-1 border-t border-solid border-separate border-neutral-300 text-[14px] shrink-0 text-secondary_text relative'>
                <div>
                  <form action="" className=' flex boder-0 border-none m-0 p-0 relative align-baseline'>
                    <textarea  className=' h-[18px] b grow-border-none outline-none resize-none active:border-none active:outline-none text-start whitespace-pre-wrap w-full rounded-none text-slate-700 appearance-none' placeholder='Add a comment...' >

                    </textarea>
                    
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default InstaPost