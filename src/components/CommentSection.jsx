import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";
export default function CommentSection({ postId }) {
   const { user } = useSelector((state) => state.user);
   const [comments, setComments] = useState("");
   const [commentError, setCommentError] = useState(null);
   const [commentList, setCommentList] = useState([]);
   const navigate = useNavigate();
   useEffect(() => {
      const fetchComments = async () => {
         try {
            const res = await axios.get(
               `/api/comment/getPostComments/${postId}`
            );
            setCommentList(res.data);
            // console.log(res.data);
         } catch (err) {
            console.log(err);
         }
      };
      fetchComments();
   }, [postId]);
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (comments.length > 200) return;
      try {
         const res = await axios.post("/api/comment/create", {
            content: comments,
            postId,
            userId: user._id,
         });

         console.log(res.status);
         if (res.status === 201) {
            setComments("");
            setCommentError(null);
            setCommentList([res.data, ...commentList]);
         }
      } catch (err) {
         setCommentError(err.message);
         console.log(err);
      }
   };

   const handleLike = async (commentId) => {
      try {
         if (!user) {
            navigate("/signIn");
            return;
         }

         const res = await axios.put(`/api/comment/likeComment/${commentId}`);
         if (res.status === 200) {
            const data = res.data;
            // console.log(data);
            setCommentList(
               commentList.map((comment) => {
                  // console.log(comment);
                  return comment._id === commentId
                     ? {
                          ...comment,
                          likes: data.likes,
                          numberOfLikes: data.likes.length,
                       }
                     : comment;
               })
            );
         }
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className='max-w-2xl mx-auto w-full p-3'>
         {user ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
               <p>Signed in as:</p>
               <img
                  src={user.profilePicture}
                  className='h-5 w-5 rounded-full object-cover'
               />
               <Link
                  to={"/dashboard?tab=profile"}
                  className='text-xm text-cyan-600 hover:underline'>
                  @{user.username}
               </Link>
            </div>
         ) : (
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
               You must be signed in to comment.
               <Link to='/signIn' className='text-blue-500 hover:underline'>
                  Sign in
               </Link>
            </div>
         )}
         {user && (
            <form
               onSubmit={handleSubmit}
               className='border border-teal-50 rounded-md p-3'>
               <TextInput
                  value={comments}
                  placeholder='Add a comment...'
                  row={3}
                  maxLenght='200'
                  onChange={(e) => setComments(e.target.value)}
               />
               <div className='flex justify-between item-center mt-5'>
                  <p className='text-gray-500 text-xm'>
                     {200 - comments.length} character remaining
                  </p>
                  <Button outline gradientDuoTone='purplrToBlue' type='submit'>
                     Submit
                  </Button>
               </div>
               {commentError && <Alert color='failure'>{commentError}</Alert>}
            </form>
         )}
         {commentList.length === 0 ? (
            <p className='text-sm my-5'>No Comments Yet!</p>
         ) : (
            <div className='text-sm my-5 flex items-center gap-1'>
               <p>Comments</p>
               <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                  <p>{commentList.length}</p>
               </div>
            </div>
         )}
         {commentList.map((comment) => {
            console.log(comment);
            return (
               <Comment key={comment} comment={comment} onLike={handleLike} />
            );
         })}
      </div>
   );
}
