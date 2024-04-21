import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import {
   HiArrowSmRight,
   HiDocumentText,
   HiOutlineUserGroup,
   HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { singOutSuccess } from "../redux/user/userSlice.js";
import axios from "axios";
import { useSelector } from "react-redux";
export default function DashboardSidebar() {
   const location = useLocation();
   const [tab, setTab] = useState("");
   const user = useSelector((state) => state.user.user);
   const dispatch = useDispatch();
   useEffect(() => {
      const urlParam = new URLSearchParams(location.search); // getting the param
      const tabFromUrl = urlParam.get("tab"); // getting the value of the param
      if (tabFromUrl) {
         setTab(tabFromUrl);
      }
   }, [location.search]);

   const handleSignOut = async () => {
      console.log("signout");
      try {
         await axios.post("/api/user/signout");
         dispatch(singOutSuccess());
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <Sidebar className='w-full md:w-56'>
         <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
               <Link to='/dashboard?tab=profile'>
                  <Sidebar.Item
                     active={tab === "profile"}
                     icon={HiUser}
                     label={user.isAdmin ? "Admin" : "User"}
                     labelColor='dark'
                     as='div'>
                     Profile
                  </Sidebar.Item>
               </Link>
               {user.isAdmin && (
                  <Link to='/dashboard?tab=posts'>
                     <Sidebar.Item
                        active={tab === "posts"}
                        icon={HiDocumentText}
                        as='div'>
                        Post
                     </Sidebar.Item>
                  </Link>
               )}
               {user.isAdmin && (
                  <Link to='/dashboard?tab=users'>
                     <Sidebar.Item
                        active={tab === "users"}
                        icon={HiOutlineUserGroup}
                        as='div'>
                        Users
                     </Sidebar.Item>
                  </Link>
               )}
               <Sidebar.Item
                  icon={HiArrowSmRight}
                  onClick={handleSignOut}
                  className='cursor-pointer'>
                  Sign Out
               </Sidebar.Item>
            </Sidebar.ItemGroup>
         </Sidebar.Items>
      </Sidebar>
   );
}
