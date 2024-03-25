import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashboardSidebar from "../components/DashboardSidebar";
import DashPost from "../components/DashPost";
export default function Dashboard() {
   const location = useLocation();
   const [tab, setTab] = useState("");

   useEffect(() => {
      const urlParam = new URLSearchParams(location.search); // getting the param
      const tabFromUrl = urlParam.get("tab"); // getting the value of the param
      if (tabFromUrl) {
         setTab(tabFromUrl);
      }
   }, [location.search]);
   return (
      <div className='min-h-screen flex flex-col md:flex-row'>
         <div className='md:w-56'>
            <DashboardSidebar />
         </div>
         {/* profile */}
         {tab === "profile" && <DashProfile />}
         {tab === "posts" && <DashPost />}
      </div>
   );
}
