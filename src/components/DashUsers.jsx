import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
export default function DashPost() {
   const user = useSelector((state) => state.user.user);
   const [users, setUsers] = useState([]);
   const [showMore, setShowMore] = useState(true);
   const [showModel, setShowModel] = useState(false);
   const [userIdToDelete, setUserIdToDelete] = useState("");
   // console.log(userPost);
   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const post = await axios.get(`/api/user/getUsers`);
            if (post.status === 200) {
               setUsers(post.data.users);
               if (post.data.users.length < 9) setShowMore(false);
               console.log(users);
            }
         } catch (err) {
            console.log(err);
         }
      };
      if (user.isAdmin) fetchUsers();
   }, [user._id]);

   const handleShowMore = async () => {
      const startIndex = users.length;
      try {
         const post = await axios.get(
            `/api/post/getUsers?startIndex=${startIndex}`
         );
         if (post.status === 200) {
            setUsers((prev) => [...prev, ...post.data.post]);
            if (post.data.post.length < 9) setShowMore(false);
         }
      } catch (err) {
         console.log(err);
      }
   };
   const handleDeletePost = async () => {
      setShowModel(false);
      try {
         const post = await axios.delete(`/api/user/delete/${user._id}`);
         if (post.status === 200) {
            setUsers((prev) =>
               prev.filter((post) => post._id !== userIdToDelete)
            );
            setShowModel(false);
         }
      } catch (err) {
         console.log(err);
      }
   };
   return (
      <div className=' table-auto overflow-x-auto  md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
         {user.isAdmin && users.length > 0 ? (
            <>
               <Table hoverable className='shadow-md'>
                  <Table.Head>
                     <Table.HeadCell>Date Created</Table.HeadCell>
                     <Table.HeadCell>User Image</Table.HeadCell>
                     <Table.HeadCell>User Name</Table.HeadCell>
                     <Table.HeadCell>Email</Table.HeadCell>
                     <Table.HeadCell>Admin</Table.HeadCell>
                     <Table.HeadCell>Delete</Table.HeadCell>
                     {/* <Table.HeadCell>
                        <span>Edit</span>
                     </Table.HeadCell> */}
                  </Table.Head>
                  {users.map((user) => (
                     <Table.Body className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                           <Table.Cell>
                              {new Date(user.createdAt).toLocaleDateString()}
                           </Table.Cell>
                           <Table.Cell>
                              <img
                                 src={user.profilePicture}
                                 alt={user.username}
                                 className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                              />
                           </Table.Cell>
                           <Table.Cell>{user.username}</Table.Cell>
                           <Table.Cell>{user.email}</Table.Cell>
                           <Table.Cell>
                              {user.isAdmin ? (
                                 <FaCheck className='text-green-500' />
                              ) : (
                                 <FaTimes className='text-red-500' />
                              )}
                           </Table.Cell>
                           <Table.Cell>
                              <span
                                 onClick={() => {
                                    setShowModel(true);
                                    setUserIdToDelete(user._id);
                                 }}
                                 className='font-medium text-red-500 hover:underline cursor-pointer'>
                                 Delete
                              </span>
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
