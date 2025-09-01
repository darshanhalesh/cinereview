import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MessageCircle, Calendar, User, Clock, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Movie {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  helpful: number;
}

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Mock movie data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMovie({
        id: movieId || '1',
        title: 'The Shawshank Redemption',
        genre: 'Drama',
        releaseYear: 1994,
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
        synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Movie+Poster',
        averageRating: 4.8,
        totalReviews: 1250
      });
      
      setReviews([
        {
          id: '1',
          userId: 'user1',
          username: 'MovieLover42',
          rating: 5,
          reviewText: 'Absolutely brilliant film. The storytelling and character development are exceptional.',
          timestamp: '2024-01-15T10:30:00Z',
          helpful: 45
        },
        {
          id: '2',
          userId: 'user2',
          username: 'CinemaFan',
          rating: 4,
          reviewText: 'Great movie with powerful performances. A classic that stands the test of time.',
          timestamp: '2024-01-14T15:20:00Z',
          helpful: 23
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [movieId]);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add movies to your watchlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement actual API call to add to watchlist
      setIsInWatchlist(!isInWatchlist);
      toast({
        title: isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist",
        description: isInWatchlist 
          ? "Movie removed from your watchlist." 
          : "Movie added to your watchlist!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      toast({
        title: "Review Required",
        description: "Please write a review before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    
    try {
      // TODO: Implement actual API call to submit review
      const newReview: Review = {
        id: Date.now().toString(),
        userId: user?.id || 'user',
        username: user?.email?.split('@')[0] || 'Anonymous',
        rating: reviewRating,
        reviewText: reviewText.trim(),
        timestamp: new Date().toISOString(),
        helpful: 0
      };

      setReviews([newReview, ...reviews]);
      setReviewText('');
      setReviewRating(5);
      setShowReviewForm(false);
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Movie not found</p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Movie Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <img 
              src={movie.posterUrl} 
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex items-center space-x-4 text-gray-300 mb-4">
                <span className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  {movie.averageRating.toFixed(1)}
                </span>
                <span>•</span>
                <span>{movie.totalReviews} reviews</span>
                <span>•</span>
                <span>{movie.releaseYear}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{movie.genre}</Badge>
                <Badge variant="outline">Directed by {movie.director}</Badge>
              </div>

              <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
            </div>

            {/* Cast */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, index) => (
                  <Badge key={index} variant="outline">{actor}</Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleAddToWatchlist}
                variant={isInWatchlist ? "secondary" : "default"}
                className="flex items-center space-x-2"
              >
                <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </Button>
              
              {isAuthenticated && (
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Write Review</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Write Your Review</CardTitle>
              <CardDescription>
                Share your thoughts about {movie.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReviewRating(star)}
                        className={`p-1 ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                      >
                        <Star className="h-6 w-6" />
                      </Button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {reviewRating} out of 5
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your thoughts about this movie..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={submittingReview}
                    className="flex-1"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Reviews ({reviews.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No reviews yet. Be the first to review this movie!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{review.username}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.reviewText}</p>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({review.helpful})</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovieDetails;
