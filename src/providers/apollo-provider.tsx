/**
 * Apollo Provider Wrapper
 * Manages Apollo Client lifecycle and provides it to the app
 * Re-creates client when credentials change
 */

import { LoadingScreen } from '@/src/components/ui/loading-screen';
import { createApolloClient } from '@/src/lib/apollo-client';
import { useAuth } from '@/src/providers/auth-provider';
import { storageService } from '@/src/services/storage.service';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import React, { useEffect, useState } from 'react';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const [client, setClient] = useState<Awaited<ReturnType<typeof createApolloClient>> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, credentials } = useAuth();

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const initializeClient = async () => {
      try {
        console.log('Apollo: Initializing client...', { 
          isAuthenticated, 
          hasCredentials: !!credentials 
        });
        
        // Check if we have credentials
        const hasCredentials = await storageService.isAuthenticated();
        console.log('Apollo: Has credentials in storage:', hasCredentials);
        
        // Add timeout to prevent hanging
        const clientPromise = createApolloClient();
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Apollo Client initialization timeout'));
          }, 5000); // 5 second timeout
        });

        const apolloClient = await Promise.race([clientPromise, timeoutPromise]) as Awaited<ReturnType<typeof createApolloClient>>;
        
        clearTimeout(timeoutId);
        
        if (mounted) {
          console.log('Apollo: Client created successfully');
          setClient(apolloClient);
          setIsInitializing(false);
        }
      } catch (error: any) {
        console.error('Failed to initialize Apollo Client:', error);
        clearTimeout(timeoutId);
        
        // Even on error, try to create a minimal client so app can continue
        // This handles cases where storage might be unavailable
        try {
          const { InMemoryCache } = await import('@apollo/client');
          const { ApolloClient } = await import('@apollo/client');
          const { HttpLink } = await import('@apollo/client');
          
          const minimalClient = new ApolloClient({
            link: new HttpLink({ uri: '' }), // Empty URL - will fail gracefully
            cache: new InMemoryCache(),
          });
          
          if (mounted) {
            console.log('Apollo: Using fallback client');
            setClient(minimalClient as any);
            setIsInitializing(false);
          }
        } catch (fallbackError) {
          console.error('Failed to create fallback client:', fallbackError);
          if (mounted) {
            setIsInitializing(false);
          }
        }
      }
    };

    initializeClient();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Clean up the client when re-creating
      if (client && isAuthenticated) {
        console.log('Apollo: Cleaning up old client');
        client.clearStore().catch(console.error);
      }
    };
  }, [isAuthenticated, credentials]); // Re-run when auth state changes

  if (isInitializing || !client) {
    return <LoadingScreen message="Initializing..." />;
  }

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}


