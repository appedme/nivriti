'use client';

import { SWRConfig } from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching data');
  }
  return res.json();
});

export function SWRProvider({ children }) {
  return (
    <SWRConfig 
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 10000, // 10 seconds
        errorRetryCount: 3,
        errorRetryInterval: 5000, // 5 seconds
      }}
    >
      {children}
    </SWRConfig>
  );
}
