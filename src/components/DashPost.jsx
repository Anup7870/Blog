import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
export default function DashPost() {
   const user = useSelector((state) => state.user.user);
   const [userPost, setUserPost] = useState([]);
   console.log(userPost);
   useEffect(() => {
      const fetUserPost = async () => {
         try {
            const post = await axios.get(
               `/api/post/getPosts?userId=${user._id}`
            );
            if (post.status === 200) {
               setUserPost(post.data.post);
            }
         } catch (err) {
            console.log(err);
         }
      };
      if (user.isAdmin) fetUserPost();
   }, [user._id]);
   return (
      <div className=' table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
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
                              <span className='font-medium text-red-500 hover:underline cursor-pointer'>
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
            </>
         ) : (
            <p>You have no post yet</p>
         )}
      </div>
   );
}
