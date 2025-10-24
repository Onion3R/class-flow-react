import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

const menuItems = [
  "Project",
  "Classes",
  "Schedules",
  "Student List"
];

function MenuComponent() {
  return (
    <Menubar className={"bg-secondary"}>
      {menuItems.map((item) => (
        <MenubarMenu key={item}>
          <MenubarTrigger>{item}</MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}

export default MenuComponent;
