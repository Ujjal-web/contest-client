import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";

import "./index.css";
import AuthProvider from "./providers/AuthProvider";
import router from "./Routes/Routes";

// TanStack Query client
const queryClient = new QueryClient();

function App() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="max-w-7xl mx-auto">
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;