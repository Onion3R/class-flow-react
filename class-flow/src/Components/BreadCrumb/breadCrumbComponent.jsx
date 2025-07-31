import React, { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useLocation } from "react-router-dom";

function   BreadCrumbComponent() {
     let location = useLocation();
  const [breadcrumbItem, setBreadcrumbItem] = useState([])
  useEffect(() => {
    setBreadcrumbItem(formatPath(location.pathname))
  }, [location])

  function formatPath(pathname) {

  let path = []
  const segments = pathname
  .split("/")
  .filter((part) => part && part !== "admin"); 

 
 segments.forEach((s) => {
  const capitalized = s.charAt(0).toUpperCase() + s.slice(1);
   const segmentPath = pathname.split("/").filter(Boolean);
  const detailIndex = segmentPath.indexOf(s);
  const url = "/" + segmentPath.slice(0, detailIndex + 1 ).join("/");

  path.push({ path: capitalized, url });
});

 if (path.length === 0) return "";
return path;
}
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItem.length > 0 &&  <BreadcrumbSeparator />}
       
         {
         
           breadcrumbItem.length > 0 &&
         breadcrumbItem.map((item, index) => {
          if(index === breadcrumbItem.length -1  ) {
            return  <BreadcrumbPage key={index}>{item.path}</BreadcrumbPage>
          } else {
            return (<>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={item.url}>{item.path}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>)
          }
         })
        
        }
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumbComponent