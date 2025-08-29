import { useEffect } from 'react';
import { useAuthStore, usePropertyStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

export function useFavouritesSync() {
  const { isAuthenticated, user } = useAuthStore();
  const { setFavourites, clearFavourites } = usePropertyStore();

  useEffect(() => {
    const syncFavourites = async () => {
      if (isAuthenticated && user) {
        try {
          // Fetch favourites from backend
          const response:any = await apiClient.getFavourites();
          if (response.success && response.data) {
            setFavourites(response.data);
          }
        } catch (error) {
          console.error('Error syncing favourites:', error);
          // Clear local favourites if sync fails
          clearFavourites();
        }
      } else {
        // Clear favourites when user logs out
        clearFavourites();
      }
    };

    syncFavourites();
  }, [isAuthenticated, user, setFavourites, clearFavourites]);

  return null;
}
