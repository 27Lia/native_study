import { QueryClient } from "react-query";

const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 60 * 1000 * 10,
      refetchIntervalInBackground: false,
      suspense: false,
      staleTime: 0,
      cacheTime: 0,
      keepPreviousData: true,
    },
    mutations: {
      retry: 0,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);

export const LOAD_SIZE_3 = 3;
export const LOAD_SIZE_5 = 5;
export const LOAD_SIZE_10 = 10;
