import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";

export default function PostPage() {
   const { postSlug } = useParams();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const [post, setPost] = useState(null);
   useEffect(() => {
      const featchPost = async () => {
         try {
            setLoading(true);
            const res = await axios.get(`/api/post/getPosts?slug=${postSlug}`);
            if (res.status !== 200) {
               setError(true);
               setLoading(false);

               return;
            }
            setPost(res.data.post[0]);
            setLoading(false);
            setError(false);
            console.log(res.data.post[0]);
         } catch (error) {
            setError(true);
            setLoading(false);
         }
      };
      featchPost();
      setLoading(true);
   }, [postSlug]);

   if (loading)
      return (
         <div className='flex justify-center items-center h-screen w-full'>
            <Spinner size='xl' />
         </div>
      );
   return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
         <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
            {post && post.title}
         </h1>
         <Link
            to={`/search?category=${post && post.catergory}`}
            className=' self-center mt-5'>
            <Button color='gray' pill size='xs'>
               {post && post.catergory}
            </Button>
         </Link>
         <img
            src={post && post.image}
            alt={post && post.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
         />
         <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>
               {post && (post.content.length / 1000).toFixed(0)} min read
            </span>
         </div>
         <div
            className='p-3 max-w-2xl mx-auto w-full post-content'
            dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
         <div className='max-w-4xl mx-auto w-full'>
            <CallToAction />
         </div>
      </main>
   );
}
