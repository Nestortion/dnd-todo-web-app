/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

// Create a new router instance
const router = createRouter({ routeTree });

const queryClient = new QueryClient();

const elem = document.getElementById("root");
const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          richColors
          expand={true}
          toastOptions={{ style: { fontFamily: "var(--font-mono)" } }}
        />
      </ThemeProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
