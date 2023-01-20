import React from 'react'

const Stories = () => {
  return (
    <div className='bg-white mb-0 mt-4 rounded-[8px] py-4 relative overflow-hidden border-2 shadow-lg'>
      <div className=' flex flex-col h-[85px] outline-0 outline-none overflow-y-hidden relative align-baseline shrink-0 '>
        {/* story wrapper */}
        <div className='flex  h-full relative overflow-x-auto overflow-y-hidden w-full'>
          <ul className='flex'>
            <li className='translate-x-[16px] p-0 m-0 align-baseline'>
              <div className='flex flex-col text-center w-[66px] h-[220px]  relative px-1 top-[2px]'>

                <button className=' cursor-pointer flex flex-col text-center'>
                  <div className='mt-1 mb-2'>
                    {/* canvas */}
                    <canvas className=" canvas  w-[64px] h-[64px] absolute -top-1 -left-1 rounded-full overflow-clip" ></canvas>
                    <span className=' block w-[56px] h-[56px] overflow-hidden'>
                      <img
                        className='w-full h-full object-cover rounded-full '


                        src="https://i.ibb.co/SrQSSpk/ag.jpg" alt="" />
                    </span>
                  </div>
                  <div className='block w-full text-[12px] font-normal'>
                    <div className='w-full px-[2px] overflow-hidden whitespace-nowrap max-w-[74px] text-ellipsis' >
                      Ni8e
                    </div>
                  </div>
                </button>
              </div>
            </li>
            <li className='translate-x-[16px] p-0 m-0 align-baseline'>
              <div className='flex flex-col text-center w-[66px] h-[220px]  relative px-1 top-[2px]'>

                <button className=' cursor-pointer flex flex-col text-center'>
                  <div className='mt-1 mb-2'>
                    {/* canvas */}
                    <canvas className=" canvas  w-[64px] h-[64px] absolute -top-1 -left-1 rounded-full overflow-clip" ></canvas>
                    <span className=' block w-[56px] h-[56px] overflow-hidden'>
                      <img
                        className='w-full h-full object-cover rounded-full '


                        src="https://i.ibb.co/SrQSSpk/ag.jpg" alt="" />
                    </span>
                  </div>
                  <div className='block w-full text-[12px] font-normal'>
                    <div className='w-full px-[2px] overflow-hidden whitespace-nowrap max-w-[74px] text-ellipsis' >
                      Ni8e
                    </div>
                  </div>
                </button>
              </div>
            </li>
          </ul>
          
        </div>
        {/* <button>
          back
        </button>
        <button>
          next
        </button> */}
      </div>
    </div>
  )
}

export default Stories