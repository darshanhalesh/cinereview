import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "./MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { MovieGridSkeleton } from "./LoadingStates";
import { ErrorState } from "./EmptyStates";

const FeaturedMovies = () => {
  const { movies, loading, error } = useMovies();
  const featuredMovies = movies.slice(0, 4);

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured <span className="text-primary">Movies</span>
          </h2>
          <ErrorState 
            title="Failed to load featured movies"
            description={error}
          />
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Featured <span className="text-primary">Movies</span>
            </h2>
            <p className="text-muted-foreground">
              Hand-picked films that define cinema
            </p>
          </div>
          <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMovies;