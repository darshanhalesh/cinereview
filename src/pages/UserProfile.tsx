import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, Calendar, User, Edit, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserReview {
  id: string;
  movieTitle: string;
  movieId: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  helpful: number;
}

interface WatchlistItem {
  id: string;
  movieTitle: string;
  movieId: string;
  genre: string;
  releaseYear: number;
  posterUrl: string;
  dateAdded: string;
}

const UserProfile = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // Simulate loading user data
    setTimeout(() => {
      setReviews([
        {
          id: '1',
          movieTitle: 'The Shawshank Redemption',
          movieId: '1',
          rating: 5,
          reviewText: 'Absolutely brilliant film. The storytelling and character development are exceptional.',
          timestamp: '2024-01-15T10:30:00Z',
          helpful: 45
        },
        {
          id: '2',
          movieTitle: 'The Godfather',
          movieId: '2',
          rating: 4,
          reviewText: 'A masterpiece of cinema. Marlon Brando delivers an unforgettable performance.',
          timestamp: '2024-01-10T14:20:00Z',
          helpful: 32
        }
      ]);

      setWatchlist([
        {
          id: '1',
          movieTitle: 'Pulp Fiction',
          movieId: '3',
          genre: 'Crime',
          releaseYear: 1994,
          posterUrl: 'https://via.placeholder.com/150x225/1f2937/ffffff?text=Pulp+Fiction',
          dateAdded: '2024-01-20T09:15:00Z'
        },
        {
          id: '2',
          movieTitle: 'Fight Club',
          movieId: '4',
          genre: 'Drama',
          releaseYear: 1999,
          posterUrl: 'https://via.placeholder.com/150x225/1f2937/ffffff?text=Fight+Club',
          dateAdded: '2024-01-18T16:30:00Z'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWatchlist = (movieId: string) => {
    setWatchlist(watchlist.filter(item => item.movieId !== movieId));
    toast({
      title: "Removed from Watchlist",
      description: "Movie removed from your watchlist.",
    });
  };

  const handleRemoveReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    toast({
      title: "Review Removed",
      description: "Your review has been removed.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-gold rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-cinema-dark" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">
                    {user.email?.split('@')[0] || 'User'}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {reviews.length} reviews
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 text-red-400 mr-1" />
                      {watchlist.length} in watchlist
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>My Reviews ({reviews.length})</span>
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Watchlist ({watchlist.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start reviewing movies to see them here!
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Browse Movies
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {review.movieTitle}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{review.reviewText}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(review.timestamp).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{review.helpful} found helpful</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/movie/${review.movieId}`)}
                          >
                            View Movie
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveReview(review.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-4">
            {watchlist.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Watchlist is Empty</h3>
                  <p className="text-gray-500 mb-4">
                    Add movies to your watchlist to see them here!
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Browse Movies
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlist.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={item.posterUrl}
                        alt={item.movieTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/movie/${item.movieId}`)}
                          className="opacity-0 hover:opacity-100 transition-opacity duration-200"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {item.movieTitle}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <Badge variant="outline">{item.genre}</Badge>
                        <span>{item.releaseYear}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Added {new Date(item.dateAdded).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromWatchlist(item.movieId)}
                          className="text-red-600 hover:text-red-700 p-1 h-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
