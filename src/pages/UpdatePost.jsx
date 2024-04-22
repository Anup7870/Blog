import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { set, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
} from "firebase/storage";
import "react-circular-progressbar/dist/styles.css";
// import { useSelector } from "react-redux";
export default function UpdatePost() {
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      reset,
   } = useForm();
   const navigate = useNavigate();
   const user = useSelector((state) => state.user.user);
   const [image, setImage] = useState(null);
   const [imageUploadProgress, setImageUploadProgress] = useState(null);
   const [imageUploadError, setImageUploadError] = useState(null);
   const [postError, setPostError] = useState(null);
   const [postSucess, setPostSucess] = useState(null);
   const [downloadURL, setDownloadURL] = useState(null);
   const [formData, setFormData] = useState(null);
   const { postId } = useParams();
   // saving the image to firebase storage
   // console.log(formData);
   const imageUplaod = async (data) => {
      console.log(data);
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
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setImageUploadProgress(progress.toFixed(0)); // to get the percentage we use toFixed(0) to remove the decimal
            },
            (error) => {
               setImageUploadError("Image upload failed. Please try again.");
               setImageUploadProgress(null); // if there is an error we clear the progress
               return;
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageUploadProgress(null);
                  setImageUploadError(null);

                  setDownloadURL(downloadURL);
                  console.log(downloadURL);
                  try {
                     const postData = { ...data, image: downloadURL };
                     const post = axios
                        .put(
                           `/api/post/updatePost/${postId}/${user._id}`,
                           postData
                        )
                        .then((data) => {
                           console.log(data.data.post.slug);
                           setPostSucess(true);
                           setPostError(false);
                           reset();
                           console.log(post);
                           navigate(`/post/${data.data.post.slug}`);
                        });
                  } catch (error) {
                     console.log(error);
                     setPostError(true);
                  }
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
      try {
         const download = await imageUplaod();
         console.log(downloadURL);
         const postData = { ...data, image: downloadURL };
         console.log(postData);
         setPostSucess(true);
         setPostError(false);
         reset();
      } catch (error) {
         console.log(error);
         setPostError(true);
      }
   };

   useEffect(() => {
      try {
         const api = axios
            .get(`/api/post/getPosts?postId=${postId}`)
            .then((data) => {
               console.log(data.data.post[0]);
               // setFormData(data.data.post[0]);
               setImage(data.data.post[0].image);
               setValue("title", data.data.post[0].title);
               setValue("content", data.data.post[0].content);
               setValue("catergory", data.data.post[0].catergory);
               setValue("image", data.data.post[0].image);
               setFormData(data.data.post[0]);
            });
      } catch (error) {
         console.log(error);
      }
   }, [postId]);

   return (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
         {postSucess ? (
            <MuiAlert severity='success'>Post uploaded sucessfully</MuiAlert>
         ) : (
            ""
         )}
         {postError ? <MuiAlert severity='error'>Unable to post</MuiAlert> : ""}
         {/* <MuiAlert severity='error'>Unable to post</MuiAlert> */}
         <h1 className='text-center text-3xl my-7 font-semibold'>
            Create a post
         </h1>
         <form
            onSubmit={handleSubmit(imageUplaod)}
            className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
               <TextInput
                  type='text'
                  placeholder='Title'
                  // value={formData ? formData.title : ""}
                  required
                  {...register("title", { required: true })}
                  id='title'
                  className='flex-1'
               />
               <Select
                  {...register("catergory", { required: true })}
                  // value={formData ? formData.catergory : ""}
               >
                  <option value='uncategorized'>Select a category</option>
                  <option value='javascript'>JavaScript</option>
                  <option value='reactjs'>React.js</option>
                  <option value='nextjs'>Next.js</option>
               </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
               <FileInput
                  // value={formData ? formData.image : null}
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
                  src={image}
                  alt='upload'
                  className='w-full h-72 object-cover'
               />
            )}
            <ReactQuill
               theme='snow'
               value={formData ? formData.content : ""}
               // {...register("content", { required: true })}
               placeholder='write something'
               className='h-72 mb-12'
               onChange={handleContentChange}
               required
            />
            <Button
               type='submit'
               gradientDuoTone='purpleToPink'
               disabled={imageUploadProgress}>
               Update Post
            </Button>
         </form>
      </div>
   );
}
