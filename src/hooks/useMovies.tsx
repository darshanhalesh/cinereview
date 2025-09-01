import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Movie {
  id: string;
  title: string;
  release_year: number;
  genre: string;
  average_rating: number;
  poster_url: string | null;
  duration: number;
  director: string | null;
  synopsis: string | null;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('average_rating', { ascending: false });

      if (error) {
        throw error;
      }

      setMovies(data || []);
    } catch (error: any) {
      console.error('Error fetching movies:', error);
      const errorMessage = 'Failed to load movies from database';
      setError(errorMessage);
      
      if (!navigator.onLine) {
        toast({
          title: "Offline",
          description: "You're offline. Using cached data if available.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const formatMovieForDisplay = (movie: Movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_year,
    genre: movie.genre,
    rating: movie.average_rating,
    poster: movie.poster_url || `https://picsum.photos/400/600?random=${movie.id}`,
    duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'N/A',
    director: movie.director,
    description: movie.synopsis
  });

  const featuredMovies = movies.slice(0, 4).map(formatMovieForDisplay);
  const trendingMovies = movies.slice(4, 8).map(formatMovieForDisplay);
  const allMoviesFormatted = movies.map(formatMovieForDisplay);

  return {
    movies: allMoviesFormatted,
    featuredMovies,
    trendingMovies,
    loading,
    error,
    refetch: fetchMovies
  };
};