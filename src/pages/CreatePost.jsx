import React, { useState } from "react";
import ReactQuill from "react-quill";
import { set, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";

import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
} from "firebase/storage";
import "react-circular-progressbar/dist/styles.css";
export default function CreatePost() {
   const {
      register,
      handleSubmit,

      formState: { errors },
      setValue,
   } = useForm();
   const [image, setImage] = useState(null);
   const [imageUploadProgress, setImageUploadProgress] = useState(null);
   const [imageUploadError, setImageUploadError] = useState(null);
   // const [value, setValue] = useState(null);

   // saving the image to firebase storage
   const imageUplaod = async () => {
      try {
         if (!image) {
            setImageUploadError("Please select an image to upload.");
            return;
         }
         setImageUploadError(null); // if to be sure the error is cleared
         const storage = getStorage(app);
         const fileName = new Date().getTime() + "-" + image.name;
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, image);

         uploadTask.on(
            "state_changed",
            (snapshot) => {
               const progress =
                  (snapshot.bytesTransfer3red / snapshot.totalBytes) * 100;
               setImageUploadProgress(progress.toFixed(0)); // to get the percentage we use toFixed(0) to remove the decimal
            },
            (error) => {
               setImageUploadError("Image upload failed. Please try again.");
               setImageUploadProgress(null); // if there is an error we clear the progress
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageUploadProgress(null);
                  setImageUploadError(null);
                  register("image", { value: downloadURL, required: true });
               });
            }
         );
      } catch (error) {
         setImageUploadError("Image upload failed. Please try again.");
         console.log(error);
      }
   };
   const handleContentChange = (content) => {
      setValue("content", content); // Set the value directly in the form hook
   };
   const handle = async (data) => {
      await imageUplaod().then(() => {
         console.log(data);
      });
   };

   return (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
         <h1 className='text-center text-3xl my-7 font-semibold'>
            Create a post
         </h1>
         <form onSubmit={handleSubmit(handle)} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
               <TextInput
                  type='text'
                  placeholder='Title'
                  required
                  {...register("title", { required: true })}
                  id='title'
                  className='flex-1'
               />
               <Select {...register("category", { required: true })}>
                  <option value='uncategorized'>Select a category</option>
                  <option value='javascript'>JavaScript</option>
                  <option value='reactjs'>React.js</option>
                  <option value='nextjs'>Next.js</option>
               </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
               <FileInput
                  type='file'
                  id='file'
                  accept='image/*'
                  onChange={(data) => setImage(data.target.files[0])}
               />
               {/* <Button
                  type='button'
                  gradientDuoTone='purpleToBlue'
                  size='sm'
                  disabled={imageUploadProgress}
                  onClick={imageUplaod}
                  outline>
                  {imageUploadProgress ? (
                     <div className='w-16 h-16'>
                        <CircularProgressbar
                           value={imageUploadProgress}
                           text={`${imageUploadProgress || 0}%`}
                        />
                     </div>
                  ) : (
                     "Upload image"
                  )}
               </Button> */}
            </div>
            {imageUploadError && (
               <Alert color='failure'>{imageUploadError}</Alert>
            )}
            {image && (
               <img
                  src={image ? URL.createObjectURL(image) : null}
                  alt='upload'
                  className='w-full h-72 object-cover'
               />
            )}
            <ReactQuill
               theme='snow'
               // {...register("content", { required: true })}
               placeholder='write something'
               className='h-72 mb-12'
               onChange={handleContentChange}
               required
            />
            <Button type='submit' gradientDuoTone='purpleToPink'>
               Publish
            </Button>
         </form>
      </div>
   );
}
