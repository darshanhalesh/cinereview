-- Fix security issues: Set search_path for all functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_movie_rating()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update average rating and review count for the movie
  UPDATE public.movies 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0) 
      FROM public.reviews 
      WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id)
    )
  WHERE id = COALESCE(NEW.movie_id, OLD.movie_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'display_name'
  );
  RETURN NEW;
END;
$$;