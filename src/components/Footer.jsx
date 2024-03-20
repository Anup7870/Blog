import React from "react";
import { Footer as Footer1 } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsGithub, BsInstagram, BsTwitterX } from "react-icons/bs";
export default function Footer() {
   return (
      <Footer1 container className='border border-t-8 border-teal-500'>
         <div className='w-full max-w-7xl mx-auto'>
            <div className='w-full grid justify-between sm:flex md:grid-cols-1'>
               <div className='mt-5'>
                  <Link
                     to='/'
                     className=' self-center whitespace-nowrap text-lg sm:text-xl  font-semibold dark:text-white'>
                     <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                        Anup's
                     </span>
                     Blog
                  </Link>
               </div>
               <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                  <div>
                     <Footer1.Title title='About' />
                     <Footer1.LinkGroup col>
                        <Footer1.Link>Portfolio</Footer1.Link>
                        <Footer1.Link>Blog's</Footer1.Link>
                     </Footer1.LinkGroup>
                  </div>
                  <div>
                     <Footer1.Title title='Follow us' />
                     <Footer1.LinkGroup col>
                        <Footer1.Link
                           href='https://www.github.com/Anup7870'
                           target='_blank'
                           rel='noreferrer noopener'>
                           Github
                        </Footer1.Link>
                        <Footer1.Link
                           href='#'
                           target='_blank'
                           rel='noreferrer noopener'>
                           Discord
                        </Footer1.Link>
                        <Footer1.Link>Blog's</Footer1.Link>
                     </Footer1.LinkGroup>
                  </div>
                  <div>
                     <Footer1.Title title='Legal' />
                     <Footer1.LinkGroup col>
                        <Footer1.Link
                           href='#'
                           target='_blank'
                           rel='noreferrer noopener'>
                           Privacy policy
                        </Footer1.Link>
                        <Footer1.Link
                           href='#'
                           target='_blank'
                           rel='noreferrer noopener'>
                           Tearm &amp; Conditions
                        </Footer1.Link>
                        {/* <Footer1.Link>Blog's</Footer1.Link> */}
                     </Footer1.LinkGroup>
                  </div>
               </div>
            </div>
            <Footer1.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
               <Footer1.Copyright
                  href='#'
                  by="Anup's Blog"
                  year={new Date().getFullYear()}
               />
               <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                  <Footer1.Icon href='#' icon={BsFacebook} />
                  <Footer1.Icon href='#' icon={BsInstagram} />
                  <Footer1.Icon href='#' icon={BsTwitterX} />
                  <Footer1.Icon href='#' icon={BsGithub} />
                  <Footer1.Icon href='#' icon={BsFacebook} />
               </div>
            </div>
         </div>
      </Footer1>
   );
}
