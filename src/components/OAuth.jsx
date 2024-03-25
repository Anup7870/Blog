import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSucess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
   const auth = getAuth(app);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const handleGoogleClick = async () => {
      const provider = new GoogleAuthProvider(); // Create a new instance of the Google provider object
      provider.setCustomParameters({ prompt: "select_account" }); // Set the custom parameters
      try {
         const resultFromGoogle = await signInWithPopup(auth, provider); // Sign in with the Google provider
         // console.log(resultFromGoogle);
         // send to the backend
         const res = await axios.post("/api/auth/google", {
            name: resultFromGoogle.user.displayName,
            email: resultFromGoogle.user.email,
            googlePhotoUrl: resultFromGoogle.user.photoURL,
         });
         // console.log(res);
         if (res.status === 200) {
            dispatch(signInSucess(res.data));
            navigate("/");
         }
      } catch (err) {
         console.log(err);
      }
   };
   return (
      <Button
         type='button'
         gradientDuoTone='pinkToOrange'
         outline
         onClick={handleGoogleClick}>
         <AiFillGoogleCircle className='w-6 h-6 mr-2' />
         Continue with Google
      </Button>
   );
}
