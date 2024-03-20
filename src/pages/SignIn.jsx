import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
   signInStart,
   signInSucess,
   signInFailure,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";
export default function SignIn() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm(); // react form hook

   const navigate = useNavigate(); // for navigation
   const dispatch = useDispatch(); // dispatching the action
   const { loading, error: errorMessage } = useSelector((state) => state.user); // getting the state from the store

   // submiting the form
   const handle = async (data) => {
      console.log(data);
      if (!data.email || !data.password) {
         dispatch(signInFailure("Please fill all the field")); // dispatching the action
         return;
      }
      try {
         dispatch(signInStart()); // dispatching the action
         const response = await axios.post("/api/auth/signIn", data);
         if (response.status === 200) {
            dispatch(signInSucess(response.data)); // dispatching the action
            navigate("/");
         }
      } catch (error) {
         console.log(error.response.status);
         if (error.response.status === 500) {
            dispatch(signInFailure(error.response.data.message));
         }
         if (error.response.data.sucess === false) {
            dispatch(signInFailure(error.response.data.message));
         }
      }
   };

   return (
      <div className='min-h-screen mt-20'>
         <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
            {/* left side */}
            <div className='flex-1'>
               <Link to='/' className='text-4xl font-bold dark:text-white'>
                  <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                     Anup's
                  </span>
                  Blog
               </Link>
               <p className='text-sm mt-5'>
                  This is a blog website. You can SignIn with your email and
                  password or google to create a new account.
               </p>
            </div>
            {/* right side */}
            <div className='flex-1 gap-5'>
               <form
                  className='flex flex-col gap-4'
                  onSubmit={handleSubmit(handle)}>
                  <div>
                     <Label value='Your Email' />
                     <TextInput
                        {...register("email", {
                           required: "Email address is required",
                           pattern: {
                              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                              message: "Invalid email address",
                           },
                        })}
                        placeholder='Enter your email address'
                        type='text'
                        name='email'
                        id='email'
                     />
                     {errors.email && (
                        <small className='text-red-500'>
                           {errors.email.message}
                        </small>
                     )}
                  </div>
                  <div>
                     <Label value='Your Password' />
                     <TextInput
                        {...register("password", {
                           required: "Password is required",
                           minLength: {
                              value: 6,
                              message:
                                 "Password must have at least 6 characters",
                           },
                        })}
                        placeholder='Enter your password'
                        type='password'
                        name='password'
                        id='password'
                     />
                     {errors.password && (
                        <small className='text-red-500'>
                           {errors.password.message}
                        </small>
                     )}
                  </div>
                  <Button
                     type='submit'
                     gradientDuoTone='purpleToPink'
                     disabled={loading}>
                     {loading ? (
                        <>
                           <Spinner size='sm' />
                           <span className='pl-3'>Loading...</span>
                        </>
                     ) : (
                        "Log In"
                     )}
                  </Button>
                  <OAuth />
               </form>
               <div className='flex gap-2 text-sm mt-5'>
                  <span>Dont Have an account ?</span>
                  <Link to='/signUp' className='text-blue-500'>
                     Sign Up
                  </Link>
               </div>
               {errorMessage && (
                  <Alert className='mt-5 text-red-500'>{errorMessage}</Alert>
               )}
            </div>
         </div>
      </div>
   );
}
