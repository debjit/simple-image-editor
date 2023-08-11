"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg, getRotatedImage } from "@/utils/canvasUtils";
import html2canvas from "html2canvas";

function Design() {
  const [imageURL, setImageURL] = useState(null);
  const [downloadableImage, setDownloadableImage] = useState(null);
  // const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [name, setName] = useState("");
  const [club, setClub] = useState("");
  const imageContainerRef = useRef(null);
  const [canDownload, setCanDownload] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
  }, []);

  useEffect(() => {
    console.log("imageURL");
  }, [imageURL]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageURL,
        croppedAreaPixels,
        rotation
      );
      // console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      console.log("This is finished, line 42.");
    } catch (e) {
      console.log("error happent");
      console.error(e);
    }
  }, [imageURL, croppedAreaPixels, rotation]);

  // Create a function to handle the file change event
  const handleFileChange = (e) => {
    // Get the selected file
    const file = e.target.files[0];

    // Check if it is an image file
    if (file && file.type.startsWith("image/")) {
      // Create a file reader
      const reader = new FileReader();

      // Set the onload event handler
      reader.onload = (e) => {
        // Set the image data URL as the source of the image element
        setImageURL(e.target.result);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
      //   console.log(file);
    }
  };

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  function preview() {
    setCanDownload(true);
    showCroppedImage();
  }

  function reset() {
    setImageURL(null);
    setDownloadableImage(null);
    setName(null);
    setClub(null);
    setCroppedImage(null);
  }

  const downloadEdited = async () => {
    try {
      await showCroppedImage();
      if (imageContainerRef.current) {
        const canvas = await html2canvas(imageContainerRef.current);
        // setDownloadableImage(canvas.toDataURL("image/png"));
        const link = document.createElement("a");
        // link.href = downloadableImage;
        link.href = canvas.toDataURL("image/png");
        link.download = "edited_image.png";
        link.click();
        console.log("This is finished, line 98.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="max-w-7xl border border-slate-800/50 mx-auto rounded-md item-center text-slate-300">
      <div className="text-center">
        <div className="border-b border-gray-900/10 p-5">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold leading-7 text-white">
              Download your certificate!
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-200">
              Please upload your image, provide name and club and get your
              certificate from us.
            </p>
          </div>
          <div className="my-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  value={name}
                  //   autocomplete="given-name"
                  onChange={(e) => setName(e.target.value)}
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                Club
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  //   autocomplete="family-name"
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="col-span-full bg-gray-900/30 rounded-md p-5">
              <label
                htmlFor="cover-photo"
                className="block text-md font-medium leading-6 text-white text-xl mb-4"
              >
                Upload your Cover Photo
              </label>
              {imageURL ? (
                <>
                  <div className="relative bg-gray-400 h-[600px] w-[600px] mx-auto ">
                    <Cropper
                      image={imageURL}
                      crop={crop}
                      rotation={rotation}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <button
                    onClick={reset}
                    className="bg-white px-4 text-blue-700 rounded-md text-xl mt-4"
                  >
                    Reset
                  </button>
                  <div className="grid grid-cols-2 m-2 gap-10">
                    <div className="w-full flex ">
                      <label
                        htmlFor="zoom"
                        className="text-lg font-medium w-1/4"
                      >
                        Zoom
                      </label>
                      <input
                        type="range"
                        id="zoom"
                        min={1}
                        max={3}
                        step={0.1}
                        className="w-3/4"
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                      />
                    </div>
                    <div className="flex">
                      <label
                        htmlFor="rotation"
                        className="text-lg font-medium  w-1/4"
                      >
                        Rotation
                      </label>
                      <input
                        type="range"
                        id="rotation"
                        min={0}
                        max={360}
                        step={1}
                        className="w-3/4"
                        value={rotation}
                        onChange={(e) => setRotation(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="px-2 relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span className="">Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1 text-gray-200">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-200 pt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {imageURL && (
            <div className="my-2 flex gap-6 justify-center">
              <button
                type="button"
                className="bg-white px-4 text-blue-700 rounded-md text-xl"
                onClick={preview}
              >
                Preview
              </button>
              {canDownload && <button
                type="button"
                className="bg-white px-4 text-blue-700 rounded-md text-xl"
                onClick={downloadEdited}
              >
                Download
              </button>}
            </div>
          )}
          {croppedImage && (
            <div
              ref={imageContainerRef}
              className="relative w-[600px] h-[600px] bg-gray-900/30 mt-4 mx-auto rounded-md m-auto"
            >
              {croppedImage && (
                <img
                  src={croppedImage}
                  className="w-[600px] h-[600px] mx-auto cover"
                />
              )}
              <img
                // src='{overlay}'
                src="../grass-overlay.png"
                className="w-[600px] h-[600px] mx-auto cover absolute top-0"
              />
              {/* <p className="absolute p-5 bg-gray-500 mx-auto top-2 text-center items-center">{name}</p> */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-whtie text-center">
                <p>{name}</p>
                <p>{club}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Design;
