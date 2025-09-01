import { Star, Heart, Plus, Check, Film } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: {
    id: string | number;
    title: string;
    year: number;
    genre: string;
    rating: number;
    poster: string;
    duration: string;
    director?: string;
    description?: string;
  };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, loading } = useWatchlist();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const movieIdStr = movie.id.toString();
  const inWatchlist = isInWatchlist(movieIdStr);

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    if (inWatchlist) {
      await removeFromWatchlist(movieIdStr);
    } else {
      await addToWatchlist(movieIdStr);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card 
      className="group bg-cinema-card border-cinema-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {imageError ? (
            <div className="w-full h-80 bg-gradient-to-br from-cinema-dark to-muted flex items-center justify-center">
              <div className="text-center">
                <Film className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-medium px-4">{movie.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{movie.year}</p>
              </div>
            </div>
          ) : (
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="sm" 
              variant="secondary" 
              className={cn(
                "bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors",
                inWatchlist && "bg-primary/20 text-primary hover:bg-primary/30",
                loading && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleWatchlistClick}
              disabled={loading}
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : inWatchlist ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" className="bg-background/20 backdrop-blur-sm hover:bg-background/40">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{movie.genre}</p>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-primary">{movie.rating}</span>
            <span className="text-muted-foreground">/5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;