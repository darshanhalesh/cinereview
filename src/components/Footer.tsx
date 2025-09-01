import { Film, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cinema-dark border-t border-cinema-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                CineReview
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              The ultimate destination for movie lovers. Share reviews, discover new films, 
              and connect with fellow cinema enthusiasts.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Featured Movies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Top Rated</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">New Releases</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Coming Soon</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Watchlists</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Discussions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cinema-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 CineReview. All rights reserved. Made with ❤️ for movie lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;