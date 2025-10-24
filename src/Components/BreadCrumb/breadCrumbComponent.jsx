import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';

function BreadCrumbComponent() {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    setBreadcrumbItems(formatPath(location.pathname));
  }, [location]);

    function formatPath(pathname) {
    const basePath = "/admin"; // adjust this if your base route is different

    const segments = pathname
      .split("/")
      .filter((part) => part && part !== "admin" && !part.startsWith("U2F"));

    return segments.map((segment, index) => {
      const formatted = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const url = `${basePath}/${segments.slice(0, index + 1).join("/")}`;

    return { path: formatted, url };
  });
}


  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return isLast ? (
            <BreadcrumbPage key={index}>{item.path}</BreadcrumbPage>
          ) : (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <Link to={item.url}>
              {item.path}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbComponent;
