import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { singOutSuccess } from "../redux/user/userSlice.js";
import axios from "axios";
export default function DashboardSidebar() {
   const location = useLocation();
   const [tab, setTab] = useState("");
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
            <Sidebar.ItemGroup>
               <Link to='/dashboard?tab=profile'>
                  <Sidebar.Item
                     active={tab === "profile"}
                     icon={HiUser}
                     label='user'
                     labelColor='dark'
                     as='div'>
                     Profile
                  </Sidebar.Item>
               </Link>
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
