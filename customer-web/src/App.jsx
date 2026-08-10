import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <SocketProvider>
              <AppRoutes />
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
