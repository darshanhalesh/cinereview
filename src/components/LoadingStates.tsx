import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// General loading spinner component
export const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

// Loading spinner with text
export const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

// Full screen loading spinner
export const FullScreenSpinner = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export const MovieCardSkeleton = () => {
  return (
    <Card className="bg-cinema-card border-cinema-border">
      <CardContent className="p-0">
        <Skeleton className="w-full h-80 rounded-t-lg" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MovieGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};