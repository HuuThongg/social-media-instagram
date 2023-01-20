import React, { useState, useEffect } from 'react';

function ImagePicker() {
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [images, setImages] = useState<string[]>([]);


  useEffect(()=>{
    console.log(images);
    if(images.length < 1){
      return;
    }
      const newImgUrls: string[]=[];
      
      console.log("uimages",images);
      images.forEach(image => 
        newImgUrls.push(URL.createObjectURL(image)));
      setImageUrls(newImgUrls);
  },[images])

  const onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setImages([...e.target.files]);
    console.log(e.target.files);
  };
  return (
    
    <>
      <input type="file" multiple accept='image/*' onChange={onImageChange} />
      {imageUrls.map(imageSrc=> 
        <img key={Math.random()} className='w-[200px] h-[200px]' src={imageSrc} alt="" />)
      }
    </>
  );
}

export default ImagePicker;

// const onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
//   const files = e.target.files;
//   if (!files) return;

//   const reader = new FileReader();
//   const fileUrls: string[] = [];

//   function readNextFile() {
//     if (files.length === 0) {
//       // All files have been read
//       setImages(fileUrls);
//       return;
//     }

//     const file = files[0];
//     reader.onloadend = () => {
//       fileUrls.push(reader.result as string);
//       files.shift();
//       readNextFile();
//     };
//     reader.readAsDataURL(file);
//   }

//   readNextFile();
// };