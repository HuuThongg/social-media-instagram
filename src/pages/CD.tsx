import React, { useEffect, useState } from "react";
import Head from 'next/head'

const loadImage = (setImageDimensions, imageUrl) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({
      height: img.height,
      width: img.width
    });
  };
  img.onerror = (err) => {
    console.log("img error");
    console.error(err);
  };
};
const CD = () => {
  const [imageDimensions, setImageDimensions] = useState({});
  const imageUrl = "https://picsum.photos/200/300";
  console.log("0")

  useEffect(() => {
    loadImage(setImageDimensions, imageUrl);
    console.log(imageDimensions);
  }, []);
  console.log("1")
  return (
    <>
      <Head>
        <title>Home / Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {Object.keys(imageDimensions).length === 0 ? (
          <b>Calculating...</b>
        ) : (
          <>
            <p>
              <b>Height:</b> {imageDimensions.height}{" "}
            </p>
            <p>
              <b>Width:</b> {imageDimensions.width}{" "}
            </p>
          </>
        )}
      </div>
    </>
  );
};
export default CD
