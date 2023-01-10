// import React, { useState, useEffect,useRef } from 'react';

// import Post from '../twpost/Post'
// import Image from 'next/image'
// import ImagePicker from '../createPost/ImagePicker'
// import {object,string} from 'zod'
// import { trpc } from '../../utils/trpc'
// import { GrImage } from 'react-icons/gr'
// import { stringify } from 'querystring';

// export const tweetSchema=object({
//   text:string({
//     required_error:'Text is required'
//   }).min(1).max(330),
//   imageUrls:string().array(),
// })

// const MainPageTw = () => {
//   const fileInput = useRef(null);
//   const [text, setText] = useState("")
//   const [error,setError] = useState(false);

//   const {mutateAsync}=trpc.tweet.create.useMutation({
//     onSuccess:()=>{
//       setText("")
//     }
//   })
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string[] >([]);

//   const [image, setImage] = useState(null);

//   const handleFileChange = (event) => {
//     const files = event.target.files;
//     const fileList = [];
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       fileList.push(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//     setImage(fileList);
//   };


//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     for (let i = 0; i < image.length; i++) {
//       formData.append('image', image[i]);
//     }
//     const text= "Upload"
//     const imageUrls = imagePreviewUrl;
//     console.log("hello");
//     mutateAsync({ text, imageUrls });

//   };
  

//   // async function handleSubmit(e: React.MouseEventHandler<HTMLButtonElement>): Promise<void> {
  
//   return (
//     <main className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto'>
//       <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
//         {/* content */}
//         <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl bg-red-200 min-h-screen h-full pointer-events-auto'>
//           {/* Home */}
//           <div className='sticky  top-0 z-[3] pointer-events-auto text-[15px]'>
//             <div className='h-[53px] max-w-[1000px] cursor-pointer flex p-4 w-full items-center justify-start mx-auto'>
//               <h1 className='text-[20px] leading-6'>
//                 <span className='block font-semibold'>Home</span>
//               </h1>
//             </div>
//           </div>
//           {/* create tweet //  new tweet */}
//           <div className='css-intial  pointer-events-auto  bg-slate-400'>
//             <div className='pb-1'>
//               <div className='flex  py-1 w-full  relative  '>
//                 {/* avatar */}
//                 <div className='flex flex-col  mt-1 mr-3  w-[48px] z-0 relative bg-transparent '>
//                   <div className='pb-[100%] pointer-events-auto block'>
//                   </div>
//                   <div className='absolute top-0 left-0 w-[48px] h-[48px]'>
//                     <div className='w-full h-full'>
//                       <Image className='rounded-full'
//                         src="https://cdn.discordapp.com/icons/937768886412132392/6693a262a7711148211abae46fe393a4.webp?size=96" alt="Picture of the author"
//                         width={500}
//                         height={500} 
                      
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {/* right side of create tweet */}
//                 <div className='flex flex-col justify-center items-start box-border  mt-1 bg-red-400 w-full h-full px-1'>
//                   {/* text */}
//                   <div className=' w-full'>
//                     <div className=''>
//                       <form onSubmit={handleSubmit}>
//                         <input type="file" multiple onChange={handleFileChange} />
//                         <button type="submit">Upload Image</button>
//                         {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" />}
//                       </form>

//                       {error && JSON.stringify(error)}

//                     </div>

//                   </div>
//                   {/* things added to a post */}
                  
                  
//                 </div>
//               </div>
//             </div>
//           </div>
//           <section className='bg-white'>
//             <Post/>
//           </section>
//         </div>
//         {/* search */}
//       </div>
//     </main>
//   )
// }

// export default MainPageTw

import React, { useState, useEffect, useRef } from 'react';

import Post from '../twpost/Post'
import Image from 'next/image'
import ImagePicker from '../createPost/ImagePicker'
import { object, string } from 'zod'
import { trpc } from '../../utils/trpc'
import { GrImage } from 'react-icons/gr'
import S3 from 'aws-sdk/clients/s3'
export const tweetSchema = object({
  text: string({
    required_error: 'Text is required'
  }).min(1).max(330),
  imageUrls: string().array(),
})
const s3= new S3({
  apiVersion: '2006-03-01',
  accessKeyId:process.env.ACCESS_KEY,
  secretAccessKey:process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
  signatureVersion:'v4',
})
const MainPageTw = () => {
  const fileInput = useRef(null);
  const [text, setText] = useState("")
  const [error, setError] = useState(false);

  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess: () => {
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
      // newImgUrls.push(URL.createObjectURL(image)));
      newImgUrls.push(URL.createObjectURL(new Blob([images]))));

    setImageUrls(newImgUrls);
    return () => URL.revokeObjectURL(images);
  }, [images])

  const onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setImages([...e.target.files]);
    console.log(e.target.files);
  };

  const handleSubbmitCreatePost = () => {
    console.log("click add images")
    fileInput.current?.click();
  };
  // async function handleSubmit(e: React.MouseEventHandler<HTMLButtonElement>): Promise<void> {
  async function handleSubmit() {
    // e.preventDefault();
    console.log("dsa")
    try {
      await tweetSchema.parse({ text, imageUrls })
    } catch (er: unknown) {
      console.log("tweet schema error");
      setError(er.message);
      return;
    }
    mutateAsync({ text, imageUrls });
  }
  return (
    <main className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto'>
      <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
        {/* content */}
        <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl bg-red-200 min-h-screen h-full pointer-events-auto'>
          {/* Home */}
          <div className='sticky  top-0 z-[3] pointer-events-auto text-[15px]'>
            <div className='h-[53px] max-w-[1000px] cursor-pointer flex p-4 w-full items-center justify-start mx-auto'>
              <h1 className='text-[20px] leading-6'>
                <span className='block font-semibold'>Home</span>
              </h1>
            </div>
          </div>
          {/* create tweet //  new tweet */}
          <div className='css-intial  pointer-events-auto  bg-slate-400'>
            <div className='pb-1'>
              <div className='flex  py-1 w-full  relative  '>
                {/* avatar */}
                <div className='flex flex-col  mt-1 mr-3  w-[48px] z-0 relative bg-transparent '>
                  <div className='pb-[100%] pointer-events-auto block'>
                  </div>
                  <div className='absolute top-0 left-0 w-[48px] h-[48px]'>
                    <div className='w-full h-full'>
                      <Image className='rounded-full'
                        src="https://cdn.discordapp.com/icons/937768886412132392/6693a262a7711148211abae46fe393a4.webp?size=96" alt="Picture of the author"
                        width={500}
                        height={500}

                      />
                    </div>
                  </div>
                </div>
                {/* right side of create tweet */}
                <div className='flex flex-col justify-center items-start box-border  mt-1 bg-red-400 w-full h-full px-1'>
                  {/* text */}
                  <div className=' w-full'>
                    <div className=''>
                      <form id="createPost" onSubmit={handleSubmit} className="flex w-full flex-col py-4 px-1 border-none rounded-md ">


                        <textarea onChange={(e) => setText(e.target.value)} className='border-none active:border-none' />
                        <div>
                          <button className='hidden' type='submit'>tweet</button>
                        </div>
                      </form>

                      {error && JSON.stringify(error)}

                    </div>

                  </div>
                  {/* things added to a post */}

                  <div className=' flex flex-col z-0 relative w-full'>
                    <div className='box-border flex items-center  flex-wrap z-[1] justify-between pointer-events-auto bg-primary_bg w-full'>
                      <div className='flex items-center justify-center mt-3'>
                        <div className='w-[36px] h-[36px]  rounded-[9999px] flex items-center justify-center cursor-pointer '
                          onClick={handleSubbmitCreatePost
                          }
                        >
                          <div className='flex items-center justify-center grow'>
                            <GrImage />
                          </div>
                        </div>
                        <input
                          className=' w-[0.1px] h-[0.1px] z-[-1] opacity-0 absolute overflow-hidden appearance-none cursor-default'
                          type="file" multiple accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime' onChange={onImageChange}
                          ref={fileInput}
                        />
                      </div>
                      <div>
                        <button
                          onClick={handleSubmit}
                        >Tweet</button>
                      </div>
                    </div>

                    {/* <ImagePicker/> */}

                    {/* 
                        {imageUrls.map(imageSrc =>
                          <img key={Math.random()} className='w-[200px] h-[200px]' src={imageSrc} alt="" />)
                    }  */}

                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className='bg-white'>
            <Post />
          </section>
        </div>
        {/* search */}
      </div>
    </main>
  )
}

export default MainPageTw