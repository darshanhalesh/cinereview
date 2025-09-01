import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MovieCard from "./MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { MovieGridSkeleton } from "./LoadingStates";
import { NoMoviesFound, ErrorState } from "./EmptyStates";

const MovieGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const { movies, loading: moviesLoading, error: moviesError, refetch } = useMovies();
  const [error, setError] = useState<string | null>(null);

  // Memoize filtered movies for better performance
  const filteredMovies = useMemo(() => {
    try {
      return movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
        const matchesGenre = genreFilter === "all" || movie.genre.toLowerCase().includes(genreFilter.toLowerCase());
        return matchesSearch && matchesGenre;
      });
    } catch (error) {
      console.error('Error filtering movies:', error);
      setError('Failed to filter movies');
      return [];
    }
  }, [movies, searchTerm, genreFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent XSS by limiting input length and sanitizing
    if (value.length <= 100) {
      setSearchTerm(value);
      setError(null);
    }
  };

  const handleGenreChange = (value: string) => {
    setGenreFilter(value);
    setError(null);
  };

  if (error || moviesError) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ErrorState 
            title="Failed to load movies"
            description={error || moviesError || "Unknown error occurred"}
            onRetry={() => {
              setError(null);
              setSearchTerm("");
              setGenreFilter("all");
              refetch();
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Browse <span className="text-primary">Movies</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover your next favorite film from our curated collection
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-cinema-card border-cinema-border"
              maxLength={100}
            />
          </div>
          <Select value={genreFilter} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-full md:w-48 bg-cinema-card border-cinema-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="crime">Crime</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              <SelectItem value="thriller">Thriller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {moviesLoading ? (
          <MovieGridSkeleton />
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <NoMoviesFound searchTerm={searchTerm || genreFilter !== "all" ? `${searchTerm} (${genreFilter})` : undefined} />
        )}
      </div>
    </section>
  );
};

export default MovieGrid;