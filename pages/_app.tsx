import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppProvider from "../context/appContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
