import React, { useState, useEffect } from 'react';

import Post from '../twpost/Post'
import Image from 'next/image'
import ImagePicker from '../createPost/ImagePicker'
import {object,string} from 'zod'
import { trpc } from '../../utils/trpc'
import { url } from 'inspector';
export const tweetSchema=object({
  text:string({
    required_error:'Text is required'
  }).min(1).max(330),
  imageUrls:string().array(),
})

const MainPageTw = () => {
  const [text, setText] = useState("")
  const [error,setError] = useState(false);

  const {mutateAsync}=trpc.tweet.create.useMutation({
    onSuccess:()=>{
      setText("")
    }
  })
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [images, setImages] = useState<string[]>([]);


  useEffect(() => {
    console.log(images);
    if (images.length < 1) {
      return;
    }
    const newImgUrls: string[] = [];

    // console.log("uimages", images);
    images.forEach(image =>
      newImgUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImgUrls);
  }, [images])

  const onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setImages([...e.target.files]);
    console.log(e.target.files);
  };


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) : Promise<void> {
    e.preventDefault();
  console.log("dsa")
    try {
      await tweetSchema.parse({ text, imageUrls })
    } catch (er:unknown) {
      console.log("tweet schema error");
      setError(er.message);
      return;
    }
    

    mutateAsync({ text, imageUrls });

  }
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
          {/* create tweet //  new tweet */}
          <div className='css-intial  pointer-events-auto  bg-slate-400'>
            <div className='pb-1'>
              <div className='flex  py-1 w-full h-[116px] relative  '>
                {/* avatar */}
                <div className='flex flex-col  mt-1 mr-3  w-[48px] z-0 relative bg-black '>
                  <div className='pb-[100%] pointer-events-auto block'>
                  </div>
                  <div className='absolute top-0 left-0 w-[48px] h-[48px]'>
                    <div className='w-full h-full'>
                      <Image className='rounded-full'
                        src="/" alt="Picture of the author"
                        width={500}
                        height={500} 
                      
                      />
                    </div>
                  </div>
                </div>
                {/* right side of create tweet */}
                <div className='css-intial pt-1'>
                  {/* text */}
                  <div className='h-[56px]'>
                    <div className='m-[2px] w-full'>
                      <div className='py-3'>
                        <form onSubmit={handleSubmit} className="flex w-full flex-col p-4 border-2 rounded-md ">
                          <input type="file" multiple accept='image/*' onChange={onImageChange} />
                          {imageUrls.map(imageSrc =>
                            <img key={Math.random()} className='w-[200px] h-[200px]' src={imageSrc} alt="" />)
                          }

                          <textarea onChange={(e) => setText(e.target.value)} />
                          <div>
                            <button type='submit'>tweet</button>
                          </div>
                        </form>

                        {error && JSON.stringify(error)}

                      </div>
                    </div>

                  </div>
                  {/* things added to a post */}
                  <div>
                    {/* <label htmlFor="image">Choose a profile picture:</label> */}
                    {/* <ImagePicker/> */}
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