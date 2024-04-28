import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";
export default function Comment({ comment, onLike, onEdit }) {
   // console.log(comment);
   const [user, setUser] = useState({});
   const [isEditing, setIsEditing] = useState(false);
   const [editedContent, setEditedContent] = useState(comment?.content);
   const currentUser = useSelector((state) => state.user.user);
   // console.log(comment.numberOfLikes);
   // console.log(editedContent);
   useEffect(() => {
      const getUser = async () => {
         try {
            const res = await axios.get(`/api/user/${comment.userId}`);
            setUser(res.data);
         } catch (err) {
            console.log(err);
         }
      };
      getUser();
   }, [comment]);
   const handleEdit = () => {
      setIsEditing(true);
   };

   const handleSave = async (e) => {
      e.preventDefault();
      try {
         const edit = await axios.put(
            `/api/comment/editComment/${comment._id}`,
            {
               content: editedContent,
            }
         );
         if (edit.status === 200) {
            setIsEditing(false);
            onEdit(comment._id, editedContent);
         }
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
         <div className='flex-shrink-0 mr-3'>
            <img
               src={user.profilePicture}
               alt={user.username}
               className='w-10 h-10 rounded-full bg-gray-200'
            />
         </div>
         <div className='flex-1'>
            <div className='flex item-center mb-1'>
               <span className='font-bold mr-1 text-xs truncate'>
                  {user ? `@${user.username}` : "anonymous user"}
               </span>
               <span>{moment(comment?.createdAt).fromNow()}</span>
            </div>
            {isEditing ? (
               <>
                  <Textarea
                     className='mb-2'
                     value={editedContent}
                     onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className='flex justify-end gap-2 text-xs'>
                     <Button
                        type='button'
                        size='sm'
                        onClick={handleSave}
                        gradientDuoTone='purpleToBlue'>
                        Save
                     </Button>
                     <Button
                        type='button'
                        size='sm'
                        outline
                        onClick={() => setIsEditing(false)}
                        gradientDuoTone='purpleToBlue'>
                        Cancel
                     </Button>
                  </div>
               </>
            ) : (
               <>
                  <p className='text-gray-500 pb-2'>{comment?.content}</p>
                  <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                     <button
                        type='button'
                        onClick={() => onLike(comment?._id)}
                        className={`text-gray-400  hover:text-blue-500 ${
                           currentUser &&
                           comment?.likes.includes(currentUser._id) &&
                           "!text-blue-500"
                        }`}>
                        <FaThumbsUp className='text-sm' />
                     </button>
                     <p className='text-gray-400'>
                        {comment?.numberOfLikes > 0 &&
                           comment?.numberOfLikes +
                              " " +
                              (comment?.numberOfLikes === 1 ? "Like" : "Likes")}
                     </p>
                     {currentUser &&
                        (currentUser._id === comment?.userId ||
                           currentUser.isAdmin) && (
                           <button
                              type='button'
                              onClick={handleEdit}
                              className='text-gray-400 hover:text-red-500'>
                              Edit
                           </button>
                        )}
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
