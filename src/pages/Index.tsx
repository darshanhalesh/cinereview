import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedMovies from "@/components/FeaturedMovies";
import TrendingMovies from "@/components/TrendingMovies";
import MovieGrid from "@/components/MovieGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedMovies />
      <TrendingMovies />
      <MovieGrid />
      <Footer />
    </div>
  );
};

export default Index;
