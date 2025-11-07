import Navigation from "@/components/page-components/root/navigation";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="px-20">
    <Navigation />
    <div className="p-4">
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
