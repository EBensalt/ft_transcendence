import React, {createRef, useState} from 'react';
// import './App.css';
import {Cropper, ReactCropperElement} from "react-cropper";
import 'cropperjs/dist/cropper.css';
import { Button } from '@mantine/core';
// import './roundedCropper.css';

// this transforms file to base64
const file2Base64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = (error) => reject(error);
  });
};

const Uploadd = ({setUserImage, image, setSave}: {setUserImage: Function, image: string | undefined, setSave: Function}) => {
  // ref of the file input
  const fileRef = createRef<HTMLInputElement>();

  // the selected image
  const [uploaded, setUploaded] = useState(null as string | null);


  // the resulting cropped image
//   const [cropped, setCropped] = useState(null as string | null);
  const [cropped, setCropped] = useState(null as string | null);


  // the reference of cropper element
  const cropperRef = createRef<ReactCropperElement>();

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      file2Base64(file).then((base64) => {
        setUploaded(base64);
      });
    }
  }

  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setCropped(cropper.getCroppedCanvas().toDataURL())
    setUserImage(cropper.getCroppedCanvas().toDataURL());
    setSave(false);
  }

  return (
    <>
      <div className="App">
        {
          uploaded ?
            <div>
              <Cropper
                src={uploaded}
                style={{height: 400, width: 400}}
                autoCropArea={1}
                aspectRatio={1}
                viewMode={3}
                guides={false}
                ref={cropperRef}
              />
              <Button onClick={onCrop}>Crop and use it</Button>
              {cropped && <img src={cropped} alt="Cropped!"/>}
            </div>
            :
            <>
              <input
                type="file"
                style={{display: 'none'}}
                ref={fileRef}
                onChange={onFileInputChange}
                accept="image/png,image/jpeg,image/gif"
              />
              <Button
                onClick={() => fileRef.current?.click()}
              >Upload something!
              </Button>
            </>}
      </div>
    </>
  );
}

export default Uploadd;