import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//provide the Instance of the QueryClient
const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
