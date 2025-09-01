import { Play, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Discover Your Next
            <span className="block bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
              Favorite Film
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join millions of movie lovers sharing reviews, building watchlists, and discovering 
            hidden gems in the world of cinema.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90 text-cinema-dark font-semibold">
              <Play className="mr-2 h-5 w-5" />
              Start Exploring
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
              Browse Movies
            </Button>
          </div>

          <div className="flex items-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>10M+ Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;