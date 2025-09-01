import { TrendingUp } from "lucide-react";
import MovieCard from "./MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { ErrorState } from "./EmptyStates";

const TrendingMovies = () => {
  const { movies, loading, error } = useMovies();
  const trendingMovies = movies.slice(4, 8);

  if (error) {
    return (
      <section className="py-16 bg-cinema-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Trending <span className="text-primary">Now</span>
          </h2>
          <ErrorState 
            title="Failed to load trending movies"
            description={error}
          />
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <TrendingUp className="h-8 w-8 text-primary mr-3" />
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Trending <span className="text-primary">Now</span>
            </h2>
            <p className="text-muted-foreground">
              What everyone's watching this week
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-cinema-card border-cinema-border rounded-lg">
                  <div className="h-80 bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingMovies;