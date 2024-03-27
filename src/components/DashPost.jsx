import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function DashPost() {
   const user = useSelector((state) => state.user.user);
   const [userPost, setUserPost] = useState([]);
   const [showMore, setShowMore] = useState(true);
   const [showModel, setShowModel] = useState(false);
   const [postIdToDelete, setPostIdToDelete] = useState("");
   // console.log(userPost);
   useEffect(() => {
      const fetUserPost = async () => {
         try {
            const post = await axios.get(
               `/api/post/getPosts?userId=${user._id}`
            );
            if (post.status === 200) {
               setUserPost(post.data.post);
               if (post.data.post.length < 9) setShowMore(false);
            }
         } catch (err) {
            console.log(err);
         }
      };
      if (user.isAdmin) fetUserPost();
   }, [user._id]);

   const handleShowMore = async () => {
      const startIndex = userPost.length;
      try {
         const post = await axios.get(
            `/api/post/getPosts?userId=${user._id}&startIndex=${startIndex}`
         );
         if (post.status === 200) {
            setUserPost((prev) => [...prev, ...post.data.post]);
            if (post.data.post.length < 9) setShowMore(false);
         }
      } catch (err) {
         console.log(err);
      }
   };
   const handleDeletePost = async () => {
      setShowModel(false);
      try {
         const post = await axios.delete(
            `/api/post/deletePost/${postIdToDelete}/${user._id}`
         );
         if (post.status === 200) {
            setUserPost((prev) =>
               prev.filter((post) => post._id !== postIdToDelete)
            );
            setShowModel(false);
         }
      } catch (err) {
         console.log(err);
      }
   };
   return (
      <div className=' table-auto overflow-x-auto  md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
         {user.isAdmin && userPost.length > 0 ? (
            <>
               <Table hoverable className='shadow-md'>
                  <Table.Head>
                     <Table.HeadCell>Date updated</Table.HeadCell>
                     <Table.HeadCell>Post image</Table.HeadCell>
                     <Table.HeadCell>Post title</Table.HeadCell>
                     <Table.HeadCell>Category</Table.HeadCell>
                     <Table.HeadCell>Delete</Table.HeadCell>
                     <Table.HeadCell>
                        <span>Edit</span>
                     </Table.HeadCell>
                  </Table.Head>
                  {userPost.map((post) => (
                     <Table.Body className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                           <Table.Cell>
                              {new Date(post.updatedAt).toLocaleDateString()}
                           </Table.Cell>
                           <Table.Cell>
                              <Link to={`/post/${post.slug}`}>
                                 <img
                                    src={post.image}
                                    alt={post.title}
                                    className='w-20 h-10 object-cover bg-gray-500'
                                 />
                              </Link>
                           </Table.Cell>
                           <Table.Cell>
                              <Link
                                 to={`/post/${post.slug}`}
                                 className='font-medium text-gray-900 dark:text-white'>
                                 {post.title}
                              </Link>
                           </Table.Cell>
                           <Table.Cell>{post.catergory}</Table.Cell>
                           <Table.Cell>
                              <span
                                 onClick={() => {
                                    setShowModel(true);
                                    setPostIdToDelete(post._id);
                                 }}
                                 className='font-medium text-red-500 hover:underline cursor-pointer'>
                                 Delete
                              </span>
                           </Table.Cell>
                           <Table.Cell>
                              <Link
                                 to={`/update-post/${post._id}`}
                                 className='text-teal-500 hover:underline'>
                                 <span>Edit</span>
                              </Link>
                           </Table.Cell>
                        </Table.Row>
                     </Table.Body>
                  ))}
               </Table>
               {showMore && (
                  <button
                     onClick={handleShowMore}
                     className='w-full text-teal-500 self-center text-sm py-7'>
                     Show More
                  </button>
               )}
            </>
         ) : (
            <p>You have no post yet</p>
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
                     <Button color='failure' onClick={handleDeletePost}>
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
