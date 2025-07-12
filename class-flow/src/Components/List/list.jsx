
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
function getInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase(); // Single name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserList({ users, title }) {
  return (
    <div className="h-[100%] min-h-[20px] max-h-[320px]  ">
      {title && <p className="font-semibold mb-4">{title}</p>}
      <ScrollArea className=" h-full rounded-md ">
        <ul className="space-y-3 pr-2">
          {users.map((user, index) => (
            <li key={index} className="flex items-center gap-4">
              <Avatar className="h-6 w-6 bg-gray-400 rounded-full flex items-center justify-center text-lg">
                <AvatarFallback className="text-[12px] text-gray-500">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-800">{user.name}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}



//  <ScrollArea className="max-h-[300px] overflow-y-auto">
//         <ul className="space-y-3 pr-2">
//           {users.map((user, index) => (
//             <li key={index} className="flex items-center gap-4">
//               <Avatar className="h-6.5 w-6.5 bg-gray-400 rounded-full flex items-center justify-center text-lg">
//                 <AvatarFallback className="text-sm text-gray-500">
//                   {getInitials(user.name)}
//                 </AvatarFallback>
//               </Avatar>
//               <span className="text-sm text-gray-800">{user.name}</span>
//             </li>
//           ))}
//         </ul>
//       </ScrollArea>



//  <li key={index} className="flex items-center gap-4">
//             {user.avatar ? (
//               // <img
//               //   src={user.avatar}
//               //   alt={user.name}
//               //   className="w-10 h-10 rounded-full object-cover"
//               // />
//               <Avatar className={"ml-9"}>
//                 <AvatarImage src={avatar} />
//                 <AvatarFallback>CN</AvatarFallback>
//               </Avatar>
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold">
//                 {getInitials(user.name)}
//               </div>
//             )}