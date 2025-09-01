import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// Custom error types for better error handling
class WatchlistError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WatchlistError';
  }
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [watchlistItems, setWatchlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlistItems([]);
      setError(null);
    }
  }, [user]);

  const fetchWatchlist = useCallback(async (retryCount = 0) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('watchlists')
        .select('movie_id')
        .eq('user_id', user.id);

      if (error) {
        throw new WatchlistError(error.message, error.code);
      }
      
      setWatchlistItems(data?.map(item => item.movie_id) || []);
    } catch (error: any) {
      console.error('Error fetching watchlist:', error);
      
      const errorMessage = error instanceof WatchlistError 
        ? error.message 
        : 'Failed to load watchlist';
      
      setError(errorMessage);
      
      // Retry logic for network errors
      if (retryCount < 2 && (error.code === 'PGRST301' || !navigator.onLine)) {
        setTimeout(() => fetchWatchlist(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const isInWatchlist = useCallback((movieId: string) => {
    return watchlistItems.includes(movieId);
  }, [watchlistItems]);

  const addToWatchlist = useCallback(async (movieId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add movies to your watchlist",
        variant: "destructive",
      });
      return false;
    }

    // Validate movieId
    if (!movieId || movieId.trim() === '') {
      toast({
        title: "Invalid movie",
        description: "Cannot add invalid movie to watchlist",
        variant: "destructive",
      });
      return false;
    }

    // Check if already in watchlist using current state directly
    if (watchlistItems.includes(movieId)) {
      toast({
        title: "Already in watchlist",
        description: "This movie is already in your watchlist",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('watchlists')
        .insert({
          user_id: user.id,
          movie_id: movieId,
        });

      if (error) {
        throw new WatchlistError(error.message, error.code);
      }

      setWatchlistItems(prev => [...prev, movieId]);
      toast({
        title: "Added to watchlist",
        description: "Movie added to your watchlist successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      
      let errorMessage = "Failed to add movie to watchlist";
      
      if (error.code === '23505') {
        errorMessage = "This movie is already in your watchlist";
      } else if (error.code === '23503') {
        errorMessage = "Movie not found";
      } else if (!navigator.onLine) {
        errorMessage = "You're offline. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, watchlistItems]);

  const removeFromWatchlist = useCallback(async (movieId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        throw new WatchlistError(error.message, error.code);
      }

      setWatchlistItems(prev => prev.filter(id => id !== movieId));
      toast({
        title: "Removed from watchlist",
        description: "Movie removed from your watchlist",
      });
      return true;
    } catch (error: any) {
      console.error('Error removing from watchlist:', error);
      
      const errorMessage = !navigator.onLine
        ? "You're offline. Please check your connection and try again."
        : "Failed to remove movie from watchlist";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  return {
    watchlistItems,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    fetchWatchlist,
  };
};