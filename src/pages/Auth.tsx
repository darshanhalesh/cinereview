import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Film, Eye, EyeOff, AlertCircle, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logTokenInfo, extractUserInfo } from '@/lib/jwt';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { signUp, signIn, session, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user was redirected from a protected route
  const from = location.state?.from?.pathname || '/';

  // Log JWT token information when session changes
  useEffect(() => {
    if (session?.access_token) {
      logTokenInfo(session.access_token);
    }
  }, [session]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (isSignUp && password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters for better security';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const { error } = isSignUp 
        ? await signUp(email.trim(), password)
        : await signIn(email.trim(), password);

      if (error) {
        // Handle specific error codes
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Try signing in instead.';
        } else if (error.message.includes('JWT')) {
          errorMessage = 'Authentication token error. Please try signing in again.';
        }
        
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Account Created",
            description: "Please check your email to verify your account. You'll receive a JWT token after confirmation.",
          });
        } else {
          toast({
            title: "Welcome Back",
            description: "JWT token generated successfully. You are now authenticated.",
          });
          // Navigation will happen automatically via useEffect
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorMessage = !navigator.onLine 
        ? 'You appear to be offline. Please check your internet connection.' 
        : 'An unexpected error occurred. Please try again.';
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show JWT token status if available
  const renderTokenStatus = () => {
    if (!session?.access_token) return null;

    const userInfo = extractUserInfo(session.access_token);
    if (!userInfo) return null;

    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2 text-green-700">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">JWT Token Active</span>
        </div>
        <div className="mt-2 text-xs text-green-600 space-y-1">
          <div>User ID: {userInfo.userId}</div>
          <div>Email: {userInfo.email}</div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Expires: {userInfo.expiresAt.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-gold rounded-full flex items-center justify-center mb-4">
            <Film className="h-6 w-6 text-cinema-dark" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Join CineReview' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Create your account to start reviewing movies'
              : 'Sign in to access your account'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90 text-cinema-dark font-semibold"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          {/* JWT Token Status */}
          {renderTokenStatus()}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <span className="ml-1 font-medium">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;