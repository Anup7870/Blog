import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import OAuth from "../components/Oauth";
export default function SignUp() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm(); // react form hook

   const navigate = useNavigate(); // for navigation
   const [errorMessage, setErrorMessage] = useState(null); // for error message
   const [loading, setLoading] = useState(false); // for loading state

   // submiting the form
   const handle = async (data) => {
      console.log(data);
      if (!data.username || !data.email || !data.password) {
         setErrorMessage("All fields are required");
         return;
      }
      try {
         setErrorMessage(null);
         setLoading(true);
         const response = await axios.post("/api/auth/signup", data);
         setLoading(false);
         if (response.status === 200) {
            navigate("/signIn");
         }
      } catch (error) {
         console.log(error.response.status);
         if (error.response.status === 500) {
            setErrorMessage(
               "Internal Server Error OR check your internet connection"
            );
            setLoading(false);
         }
         if (error.response.data.sucess === false) {
            setErrorMessage(error.response.data.message);
            setLoading(false);
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
                  This is a blog website. You can SignUp with your email and
                  password or google to create a new account.
               </p>
            </div>
            {/* right side */}
            <div className='flex-1 gap-5'>
               <form
                  className='flex flex-col gap-4'
                  onSubmit={handleSubmit(handle)}>
                  <div>
                     <Label value='Your username' />
                     <TextInput
                        {...register("username", { required: true })}
                        placeholder='Enter your user name'
                        type='text'
                        name='username'
                        id='username'
                     />
                  </div>
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
                        "Sign Up"
                     )}
                  </Button>
                  <OAuth />
               </form>
               <div className='flex gap-2 text-sm mt-5'>
                  <span>Have an account ?</span>
                  <Link to='/signIn' className='text-blue-500'>
                     Sign In
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
