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

function BreadCrumbComponent() {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    setBreadcrumbItems(formatPath(location.pathname));
  }, [location]);

  function formatPath(pathname) {
    const segments = pathname
      .split("/")
      .filter((part) => part && part !== "admin");

    return segments.map((segment, index) => {
      // Capitalize each word in kebab-case
      const formatted = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const url = "/" + segments.slice(0, index + 1).join("/");

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
                <BreadcrumbLink href={item.url}>{item.path}</BreadcrumbLink>
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
