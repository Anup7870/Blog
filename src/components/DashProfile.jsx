import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
   updateStart,
   updateFaliure,
   updateSucess,
   deleteUserSuccess,
   deleteUserStart,
   deleteUserFaliure,
   singOutSuccess,
} from "../redux/user/userSlice";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import {
   getDownloadURL,
   getStorage,
   ref,
   uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function DashProfile() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const dispatch = useDispatch();
   const currentUser = useSelector((state) => state.user.user);
   const error = useSelector((state) => state.user.error);
   const loading = useSelector((state) => state.user.loading);
   const user = useSelector((state) => state.user.user);
   const [imageFile, setImageFile] = useState(null);
   const [imageUrl, setImageUrl] = useState(null);
   const [imageFileUplaodingProgress, setImageFileUplaodingProgress] =
      useState(null);
   const [imageFileUplaodError, setImageFileUplaodError] = useState(null);
   const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
   const [showModel, setShowModel] = useState(false);
   const filePickerRef = useRef(null);

   const handleImage = (e) => {
      setImageFileUplaodError(null);
      const file = e.target.files[0];
      if (file) {
         setImageFile(file);
         setImageUrl(URL.createObjectURL(file));
      }
   };

   useEffect(() => {
      if (imageFile) {
         uploadImage();
      }
   }, [imageFile]);

   const uploadImage = async () => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName); // refer to the file in storage
      const uploadTask = uploadBytesResumable(storageRef, imageFile); // upload the file

      uploadTask.on(
         "state_changed", // track the upload progress
         (snapshot) => {
            const progress =
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUplaodingProgress(progress.toFixed(0));
         },
         (error) => {
            setImageFileUplaodError(
               "could not upload image (file must be less than 2MB)"
            );
            setImageFileUplaodingProgress(null);
            setImageFile(null);
            setImageUrl(null);
         },
         () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               setImageUrl(downloadURL);
            });
         }
      );
   };

   const updateUser = async (e) => {
      // inserting the image in the react form hook data
      const data = {
         // inserting the image in the react form hook data (firebase url)
         ...e,
         profilePicture: imageUrl || currentUser.profilePicture,
      };
      try {
         dispatch(updateStart());
         const res = await axios.put(
            `/api/user/update/${currentUser._id}`,
            data
         );
         if (res.status === 200) {
            dispatch(updateSucess(data));
            setUpdateUserSuccess("User updated successfully");
         } else {
            dispatch(updateFaliure(res.message));
            setUpdateUserSuccess(res.message);
         }
      } catch (error) {
         dispatch(updateFaliure(error.response.data.message));
         setUpdateUserSuccess(error.response.data.message);
      }
   };

   const handleDeleteUser = async () => {
      setShowModel(false);
      try {
         dispatch(deleteUserStart());
         const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
         dispatch(deleteUserSuccess());
      } catch (err) {
         console.log(err.response.data.message);
         dispatch(deleteUserFaliure(err.response.data.message));
         console.log(err);
      }
   };

   const handleSignOut = async () => {
      try {
         await axios.post("/api/user/signout");
         dispatch(singOutSuccess());
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className=' w-full sm:w-[50%] m-x-lg p-3 mx-auto '>
         <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
         <form
            onSubmit={handleSubmit(updateUser)}
            className='flex flex-col gap-4'>
            <input
               type='file'
               accept='image/*'
               onChange={handleImage}
               ref={filePickerRef}
               hidden
            />
            <div
               className='w-32 relative h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
               onClick={() => filePickerRef.current.click()}>
               {imageFileUplaodingProgress && (
                  <CircularProgressbar
                     value={imageFileUplaodingProgress || 0}
                     text={`${imageFileUplaodingProgress}%`}
                     strokeWidth={5}
                     styles={{
                        root: {
                           widht: "100%",
                           height: "100%",
                           position: "absolute",
                           top: 0,
                           left: 0,
                        },
                        path: {
                           stroke: `rgba(62, 152, 199, ${
                              imageFileUplaodingProgress / 100
                           })`,
                        },
                     }}
                  />
               )}
               <img
                  src={imageUrl || user.profilePicture}
                  alt='user'
                  className={`rounded-full w-full h-full object-cover border-8  b border-[lightgray] ${
                     imageFileUplaodingProgress &&
                     imageFileUplaodingProgress < 100 &&
                     "opacity-60"
                  }`}
               />
            </div>
            {imageFileUplaodError && (
               <Alert className='text-red-600 bg-red-200'>
                  {imageFileUplaodError}
               </Alert>
            )}

            <TextInput
               type='text'
               id='username'
               placeholder='username'
               defaultValue={user.username}
               {...register("username", {
                  pattern: {
                     pattern: /^[a-zA-Z0-9_]{6,20}^/,
                     message: "username must be 6-20 characters long",
                  },
               })}
            />
            {errors.usename && (
               <small className='text-red-500'>{errors.username.message}</small>
            )}
            <TextInput
               type='text'
               id='email'
               placeholder='email'
               defaultValue={user.email}
               {...register("email", {
                  pattern: {
                     value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                     message: "Invalid email address",
                  },
               })}
            />
            {errors.email && (
               <small className='text-red-500'>{errors.email.message}</small>
            )}
            <TextInput
               type='text'
               id='password'
               placeholder='passowrd'
               {...register("password", {
                  minLength: {
                     value: 6,
                     message: "password must be at least 6 characters long",
                  },
               })}
            />
            {errors.password && (
               <small className='text-red-500'>{errors.password.message}</small>
            )}
            <Button
               type='submit'
               gradientDuoTone='purpleToBlue'
               outline
               disabled={loading}>
               {loading ? "Loading..." : "Update"}
            </Button>
            {user.isAdmin && (
               <Link to={"/create-post"}>
                  <Button
                     type='button'
                     gradientDuoTone='purpleToPink'
                     className='w-full'>
                     Create a post
                  </Button>
               </Link>
            )}
         </form>
         <div className='text-red-500 flex justify-between mt-5'>
            <span
               onClick={() => setShowModel(true)}
               className=' cursor-pointer'>
               Delete Account
            </span>
            <span onClick={handleSignOut} className=' cursor-pointer'>
               Sign out
            </span>
         </div>
         {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
               {updateUserSuccess}
            </Alert>
         )}
         {error && (
            <Alert color='failure' className='mt-5'>
               {error}
            </Alert>
         )}
         <Modal
            show={showModel}
            onClose={() => setShowModel(false)}
            popup
            size='md'>
            <Modal.Header />
            <Modal.Body>
               <div className='text-center'>
                  <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                     Are you sure you want to delete your account
                  </h3>
                  <div className='flex justify-center gap-4'>
                     <Button color='failure' onClick={handleDeleteUser}>
                        Yes Delete
                     </Button>
                     <Button color='gray' onClick={() => setShowModel(false)}>
                        No, cancel
                     </Button>
                  </div>
               </div>
            </Modal.Body>
         </Modal>
      </div>
   );
}
