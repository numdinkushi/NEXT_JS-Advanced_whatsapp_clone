import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";

function ChatListHeader() {
  const [{userInfo}, dispatch] = useStateProvider();
console.log(userInfo);

  return <div className="h-16 px-4 justify-between items-center ">
   <div className="cursor-pointer">
    <Avatar type="sm" image={userInfo?.profileImage} />
   </div>
   <div className="flex"></div>
  </div>;
}

export default ChatListHeader;
