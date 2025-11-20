import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import ProjectsDialog from "./projects-dialog";
import { memo } from "react";

const Navigation = memo(() => {
  return (
    <NavigationMenu className="justify-between w-full p-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" className="font-medium text-xl">
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* <NavigationMenuItem> */}
        {/*   <NavigationMenuLink asChild> */}
        {/*     <Link to="/create-task" className="font-medium text-xl"> */}
        {/*       Maintenance */}
        {/*     </Link> */}
        {/*   </NavigationMenuLink> */}
        {/* </NavigationMenuItem> */}
        <NavigationMenuItem>
          <ProjectsDialog />
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
});

export default Navigation;
