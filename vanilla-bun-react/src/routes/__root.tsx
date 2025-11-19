import Navigation from "@/components/page-components/root/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataContextWrapper } from "@/context";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <ScrollArea className="box-border relative h-screen w-screen">
    <div className="mx-20">
      <Navigation />
      <div className="p-4">
        <DataContextWrapper>
          <Outlet />
        </DataContextWrapper>
      </div>
      <TanStackRouterDevtools />
    </div>
  </ScrollArea>
);

export const Route = createRootRoute({ component: RootLayout });
