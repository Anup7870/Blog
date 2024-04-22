import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
   return (
      <div className='text-center flex flex-col sm:flex-row p-3 border border-teal-500 justify-center item-center rounded-tl-3xl rounded-br-3xl'>
         <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl '>Want to learn more about javascript</h2>
            <p className='text-gray-500 my-2'>
               Checkout thesr resources with 100 javascript project
            </p>
            <Button
               className=' rounded-tl-xl rounded-bl-none'
               gradientDuoTone='purpleToPink'>
               <a
                  href='https://www.100jsprojects.com'
                  target='_balnk'
                  rel='noopener noreferrer'>
                  100 javaScript Projects
               </a>
            </Button>
         </div>
         <div className='p-7 flex-1'>
            <img
               src='https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg'
               //  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0tRffe3TQL6kW5wcGlb-Tn-72xNkEqAagFR4gYBLk4b74kLr49Y6w5rH7j2ZGpzKj5rY&usqp=CAU'
               alt=''
            />
         </div>
      </div>
   );
}
